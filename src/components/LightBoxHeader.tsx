import { MouseEventHandler } from 'react'
import { IoIosClose } from 'react-icons/io'

export const LightBoxHeader = ({ onClose }: { onClose: MouseEventHandler }) => {
  return (
    <div className="light-box-header">
      <IoIosClose onClick={onClose} />
    </div>
  )
}
