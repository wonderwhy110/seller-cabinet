import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Input, InputNumber, Select, Button, Spin, Alert, message, Popover } from 'antd'
import { ArrowLeftOutlined, CloseOutlined, BulbOutlined } from '@ant-design/icons'
import { itemApi } from '@entities/item'
import { CategoryFields } from '@features/edit-form'
import { CATEGORY_OPTIONS } from '@shared/lib'
import type { Category, ItemUpdateIn } from '@shared/types'
import { geminiGenerate as generate } from '@shared/api'
import styles from './AdEditPage.module.css'

const DRAFT_KEY = (id: string) => `draft_${id}`

export const AdEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const [currentCategory, setCurrentCategory] = useState<Category>('electronics')
  const [charCount, setCharCount] = useState(0)


  const [aiDescription, setAiDescription] = useState<string | null>(null)
  const [aiPrice, setAiPrice] = useState<string | null>(null)
  const [aiDescLoading, setAiDescLoading] = useState(false)
  const [aiPriceLoading, setAiPriceLoading] = useState(false)

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['item', id],
    queryFn: ({ signal }) => itemApi.getItem(Number(id), signal),
    enabled: !!id && !isNaN(Number(id)),
  })

  useEffect(() => {
    if (!item) return

    const draft = localStorage.getItem(DRAFT_KEY(id!))
    if (draft) {
      const parsed = JSON.parse(draft)
      form.setFieldsValue(parsed)
      setCurrentCategory(parsed.category)
      setCharCount((parsed.description || '').length)
      messageApi.info('Восстановлен черновик')
    } else {
      form.setFieldsValue(item)
      setCurrentCategory(item.category)
      setCharCount((item.description || '').length)
    }
  }, [item])

  // Сохраняем черновик при каждом изменении формы
  const handleValuesChange = (_: unknown, allValues: unknown) => {
    localStorage.setItem(DRAFT_KEY(id!), JSON.stringify(allValues))
  }

  const { mutate: saveItem, isPending } = useMutation({
    mutationFn: (data: ItemUpdateIn) => itemApi.updateItem(Number(id), data),
    onSuccess: () => {
      localStorage.removeItem(DRAFT_KEY(id!))
      queryClient.invalidateQueries({ queryKey: ['item', id] })
      queryClient.invalidateQueries({ queryKey: ['items'] })
      messageApi.success('Сохранено!')
      setTimeout(() => navigate(`/ads/${id}`), 800)
    },
    onError: () => {
      messageApi.error('Ошибка при сохранении')
    },
  })

  const handleSubmit = (values: ItemUpdateIn) => {
    saveItem(values)
  }

  const handleCancel = () => {
    navigate(`/ads/${id}`)
  }

  const handleGenerateDescription = async () => {
    setAiDescLoading(true)
    setAiDescription(null)
    try {
      const values = form.getFieldsValue()
      const prompt = `Ты копирайтер на Авито. Напиши привлекательное описание для объявления:
Название: ${values.title || ''}
Категория: ${values.category || ''}
Цена: ${values.price || ''} руб.
Параметры: ${JSON.stringify(values.params || {})}
Требования: 3-5 предложений, без вводных слов, сразу к делу, на русском языке.`
      const result = await generate(prompt)
      setAiDescription(result)
    } catch {
      messageApi.error('Ошибка. Проверьте что Ollama запущена.')
    } finally {
      setAiDescLoading(false)
    }
  }

  const handleEstimatePrice = async () => {
    setAiPriceLoading(true)
    setAiPrice(null)
    try {
      const values = form.getFieldsValue()
      const prompt = `Ты эксперт по ценам на Авито в 2026 году.
    
Объявление: "${values.title}"
Категория: ${values.category}
Параметры: ${JSON.stringify(values.params || {})}

Задача: определи РЕАЛИСТИЧНУЮ рыночную цену в рублях на 2026 год.

Правила:
- Ориентируйся на средние цены на Авито в 2026 году
- Не завышай цену, будь объективен
- Учитывай состояние и комплектацию
- Для техники учитывай амортизацию

Формат ответа:
Рекомендуемая цена: X рублей.
Обоснование: одно предложение (максимум 2 предложения).`
      const result = await generate(prompt)
      setAiPrice(result)
    } catch {
      messageApi.error('Ошибка подключения в ИИ.')
    } finally {
      setAiPriceLoading(false)
    }
  }

  const applyDescription = () => {
    if (!aiDescription) return
    form.setFieldValue('description', aiDescription)
    setCharCount(aiDescription.length)
    setAiDescription(null)
    messageApi.success('Описание применено')
  }

  const applyPriceSuggestion = () => {
    if (!aiPrice) return
    const match = aiPrice.match(/(\d+[\s]?\d*)/)
    if (match) {
      const suggestedPrice = parseInt(match[0].replace(/\s/g, ''))
      if (!isNaN(suggestedPrice)) {
        form.setFieldValue('price', suggestedPrice)
        messageApi.success(`Цена установлена: ${suggestedPrice} руб.`)
      }
    }
    setAiPrice(null)
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
        <Alert type="error" title="Объявление не найдено" showIcon />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/ads')}>
          ← К списку
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {contextHolder}

      <div className={styles.backBtn}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/ads/${id}`)}>
          К объявлению
        </Button>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Редактирование объявления</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
        >
          <Form.Item
            name="category"
            label="Категория"
            className={styles.subtitle}
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select
              options={CATEGORY_OPTIONS}
              allowClear
              placeholder="Выберите категорию"
              style={{ maxWidth: '456px', width: '100%' }}
              onChange={(val: Category) => {
                setCurrentCategory(val)
                form.setFieldValue('params', {})
              }}
            />
          </Form.Item>
          <hr className={styles.divider} />

          <Form.Item
            name="title"
            label="Название"
            className={styles.subtitle}
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input
              style={{ maxWidth: '456px', width: '100%' }}
              placeholder="Например: iPhone 14 Pro"
              allowClear
            />
          </Form.Item>
          <hr className={styles.divider} />

          <div className={styles.priceWrapper}>
            <Form.Item
              name="price"
              label="Цена (руб.)"
              className={styles.subtitle}
              rules={[{ required: true, message: 'Введите цену' }]}
            >
              <InputNumber
                min={0}
                style={{ maxWidth: '456px', width: '456px' }}
                placeholder="0"
                controls={false}
              />
            </Form.Item>

            <Popover
              content={
                aiPrice ? (
                  <div style={{ maxWidth: 300 }}>
                    <p className={styles.aiResultText}>{aiPrice}</p>
                    <Button
                      size="small"
                      type="primary"
                      onClick={applyPriceSuggestion}
                      style={{ marginTop: 8, width: '100%' }}
                    >
                      Применить цену
                    </Button>
                  </div>
                ) : null
              }
              title="Ответ AI"
              trigger="click"
              open={!!aiPrice}
              onOpenChange={(open) => {
                if (!open) setAiPrice(null)
              }}
              placement="top"
            >
              <Button
                className={styles.butonAi}
                icon={<BulbOutlined />}
                loading={aiPriceLoading}
                onClick={handleEstimatePrice}
              >
                Узнать рыночную цену
              </Button>
            </Popover>
          </div>

          <hr className={styles.divider} />
          <h2 className={styles.subtitle}>Характеристики</h2>

          <CategoryFields category={currentCategory} />

          <hr className={styles.divider} />

          <Form.Item name="description" label={<span className={styles.subtitle}>Описание</span>}>
            <Input.TextArea
              rows={5}
              placeholder="Расскажите подробнее о товаре..."
              onChange={(e) => setCharCount(e.target.value.length)}
              allowClear
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <div style={{ maxWidth: '456px', width: '100%' }}>
            <Popover
              content={
                aiDescription ? (
                  <div style={{ maxWidth: 400 }}>
                    <p className={styles.aiResultText}>{aiDescription}</p>
                    <Button
                      size="small"
                      type="primary"
                      onClick={applyDescription}
                      style={{ marginTop: 8, width: '100%' }}
                    >
                      Применить описание
                    </Button>
                  </div>
                ) : null
              }
              title="Ответ Ai:"
              trigger="click"
              open={!!aiDescription}
              onOpenChange={(open) => {
                if (!open) setAiDescription(null)
              }}
              placement="top"
            >
              <Button
                className={styles.butonAiSecond}
                icon={<BulbOutlined />}
                loading={aiDescLoading}
                onClick={handleGenerateDescription}
                style={{ marginBottom: 8 }}
              >
                {form.getFieldValue('description') ? 'Улучшить описание' : 'Придумать описание'}
              </Button>
            </Popover>
          </div>

          {/* Кнопки */}
          <div className={styles.actions}>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Сохранить
            </Button>
            <Button icon={<CloseOutlined />} onClick={handleCancel}>
              Отменить
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
