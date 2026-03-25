import { Form, Input, InputNumber, Select } from 'antd'
import type { Category } from '@shared/types'
import styles from './CategoryFields.module.css'

interface Props {
  category: Category
}

const fieldStyle = { maxWidth: '456px', width: '100%' }

export const CategoryFields = ({ category }: Props) => {
  if (category === 'electronics') {
    return (
      <>
        <Form.Item 
          name={['params', 'type']} 
          label={<span className={styles.subtitle}>Тип</span>}
          style={fieldStyle}
        >
          <Select
            allowClear
            placeholder="Выберите тип"
            options={[
              { value: 'phone', label: 'Телефон' },
              { value: 'laptop', label: 'Ноутбук' },
              { value: 'misc', label: 'Другое' },
            ]}
          />
        </Form.Item>
        <Form.Item 
          name={['params', 'brand']} 
          label={<span className={styles.subtitle}>Бренд</span>}
          style={fieldStyle}
        >
          <Input placeholder="Apple, Samsung..." allowClear />
        </Form.Item>
        <Form.Item 
          name={['params', 'model']} 
          label={<span className={styles.subtitle}>Модель</span>}
          style={fieldStyle}
        >
          <Input placeholder="iPhone 15, Galaxy S24..." allowClear />
        </Form.Item>
        <Form.Item 
          name={['params', 'condition']} 
          label={<span className={styles.subtitle}>Состояние</span>}
          style={fieldStyle}
        >
          <Select
            allowClear
            placeholder="Выберите состояние"
            options={[
              { value: 'new', label: 'Новое' },
              { value: 'used', label: 'Б/у' },
            ]}
          />
        </Form.Item>
        <Form.Item 
          name={['params', 'color']} 
          label={<span className={styles.subtitle}>Цвет</span>}
          style={fieldStyle}
        >
          <Input placeholder="Чёрный, белый..." allowClear />
        </Form.Item>
      </>
    )
  }

  if (category === 'auto') {
    return (
      <>
        <Form.Item 
          name={['params', 'brand']} 
          label={<span className={styles.subtitle}>Марка</span>}
          style={fieldStyle}
        >
          <Input placeholder="Toyota, BMW..." allowClear />
        </Form.Item>
        <Form.Item 
          name={['params', 'model']} 
          label={<span className={styles.subtitle}>Модель</span>}
          style={fieldStyle}
        >
          <Input placeholder="Camry, X5..." allowClear />
        </Form.Item>
        <Form.Item 
          name={['params', 'yearOfManufacture']} 
          label={<span className={styles.subtitle}>Год выпуска</span>}
          style={fieldStyle}
        >
          <InputNumber 
            min={1900} 
            max={2026} 
            style={{ width: '100%' }} 
            placeholder="2020"
            controls={false}
          />
        </Form.Item>
        <Form.Item 
          name={['params', 'transmission']} 
          label={<span className={styles.subtitle}>Трансмиссия</span>}
          style={fieldStyle}
        >
          <Select
            allowClear
            placeholder="Выберите тип"
            options={[
              { value: 'automatic', label: 'Автомат' },
              { value: 'manual', label: 'Механика' },
            ]}
          />
        </Form.Item>
        <Form.Item 
          name={['params', 'mileage']} 
          label={<span className={styles.subtitle}>Пробег (км)</span>}
          style={fieldStyle}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }} 
            placeholder="50000"
            controls={false}
          />
        </Form.Item>
        <Form.Item 
          name={['params', 'enginePower']} 
          label={<span className={styles.subtitle}>Мощность (л.с.)</span>}
          style={fieldStyle}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }} 
            placeholder="150"
            controls={false}
          />
        </Form.Item>
      </>
    )
  }

  if (category === 'real_estate') {
    return (
      <>
        <Form.Item 
          name={['params', 'type']} 
          label={<span className={styles.subtitle}>Тип жилья</span>}
          style={fieldStyle}
        >
          <Select
            allowClear
            placeholder="Выберите тип"
            options={[
              { value: 'flat', label: 'Квартира' },
              { value: 'house', label: 'Дом' },
              { value: 'room', label: 'Комната' },
            ]}
          />
        </Form.Item>
        <Form.Item 
          name={['params', 'address']} 
          label={<span className={styles.subtitle}>Адрес</span>}
          style={fieldStyle}
        >
          <Input placeholder="Москва, ул. Ленина, 1" allowClear />
        </Form.Item>
        <Form.Item 
          name={['params', 'area']} 
          label={<span className={styles.subtitle}>Площадь (м²)</span>}
          style={fieldStyle}
        >
          <InputNumber 
            min={1} 
            style={{ width: '100%' }} 
            placeholder="45.5"
            controls={false}
          />
        </Form.Item>
        <Form.Item 
          name={['params', 'floor']} 
          label={<span className={styles.subtitle}>Этаж</span>}
          style={fieldStyle}
        >
          <InputNumber 
            min={1} 
            style={{ width: '100%' }} 
            placeholder="3"
            controls={false}
          />
        </Form.Item>
      </>
    )
  }

  return null
}