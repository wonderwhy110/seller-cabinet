import { Alert } from 'antd'

import styles from './NeedsRevisionAlert.module.css'
import { FIELD_LABELS } from '@shared/lib'
import Text from 'antd/es/typography/Text'

interface Props {
  fields: string[]
}

export const NeedsRevisionAlert = ({ fields }: Props) => {
  const labels = fields.map((f) => FIELD_LABELS[f] ?? f)

  return (
    <Alert
      type="warning"
      showIcon
      message="Требуются доработки"
      className={styles.alert}
      description={
        <> 
        <div className={styles.description}>У объявления не заполнено:</div>
        <ul className={styles.list}>
          {labels.map((label) => (
            <li key={label} className={styles.listItem}>
              {label}
            </li>
          ))}
        </ul>
        </>
      }
    />
  )
}