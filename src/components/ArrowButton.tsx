import { MouseEventHandler } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

export const ArrowButton = ({
  onClick,
  position,
}: {
  onClick: MouseEventHandler
  position: string
}) => {
  return (
    <div
      className={`arrow-button-container align-${position}`}
      onClick={onClick}
    >
      {position === 'left' ? <IoIosArrowBack /> : <IoIosArrowForward />}
    </div>
  )
}
