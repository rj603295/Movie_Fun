import React, { useState, useCallback, useRef } from 'react'
import './Carousel.css'

const Item = ({ children }) => <div>{children}</div>

const CAROUSEL_ITEM = 'CAROUSEL_ITEM'
const Carousel = ({ cols = 1, gap = 10, children }) => {
  const [currentPage, setCurrentPage] = useState(0)

  // const [startX, setStartX] = useState(0)
  // const [startY, setStartY] = useState(0)
  // const [endX, setEndX] = useState(0)
  // const [endY, setEndY] = useState(0)

  // let startX = useRef(0)
  // let startY = useRef(0)
  // let endX = useRef(0)
  // let endY = useRef(0)

  let startX = 0
  let startY = 0
  let endX = 0
  let endY = 0

  const itemList = React.Children.toArray(children).filter(
    child => child.type.displayName === CAROUSEL_ITEM
  )

  const itemSetList = itemList.reduce((result, item, i) => {
    if (i % cols === 0) {
      result.push([<Item key={i}>{item}</Item>])
    } else {
      result[result.length - 1].push(<Item key={i}>{item}</Item>)
    }

    return result
  }, [])

  const page = Math.ceil(itemList.length / cols)

  const handlePrev = useCallback(() => {
    setCurrentPage(p => p - 1)
  }, [])

  const handleNext = useCallback(() => {
    setCurrentPage(p => p + 1)
  }, [])

  //自己改Start
  const handleTouchStart = (e) => {
    // e.preventDefault()
    console.log('start',e.touches[0].pageX)
    // setStartX(e.touches[0].pageX)
    // setStartY(e.touches[0].pagey)
    startX = e.touches[0].pageX
    startY = e.touches[0].pageY
  }
  const handleTouchMove = (e) => {
    console.log('move',e.touches[0].pageX)
    // e.preventDefault()
    // setEndX(e.touches[0].pageX)
    // setEndY(e.touches[0].pagey)
    endX = e.touches[0].pageX
    endY = e.touches[0].pageY
  }
  
  const handleTouchEnd = (e) => {
    let X = endX - startX
    let Y = endY - startY
    console.log('X', X)
    if (X > 0 && Math.abs(X) > Math.abs(Y)) {
      //向右
      if (currentPage > 0) {
        setCurrentPage(p => p - 1)
      }

      console.log('向右');
    } else if (X < 0 && Math.abs(X) > Math.abs(Y)) {
      //向左
      console.log('向左');
      if(currentPage !== page - 1){
        setCurrentPage(p => p + 1)
      }

    } else if (Y > 0 && Math.abs(Y) > Math.abs(X)) {
      //向下
      console.log('向下');
    } else if (Y < 0 && Math.abs(Y) > Math.abs(X)) {
      //向上
      console.log('向上');
    } else {
      //没有
      console.log('没有');
    }
  }
  //自己改End
  return (
    <div className="Carousel" onTouchStart={(e) => handleTouchStart(e)} onTouchMove={e => handleTouchMove(e)} onTouchEnd={(e) => handleTouchEnd(e)}>
      <span
        className="Carousel__btn--prev"
        hidden={currentPage <= 0}
        onClick={handlePrev}
      />
      <div className="Carousel__railWrapper">
        <div
          className="Carousel__rail"
          style={{
            gridTemplateColumns: `repeat(${page}, 100%)`,
            left: `calc(${-100 * currentPage}% - ${gap * currentPage}px)`,
            gridColumnGap: `${gap}px`
          }}
        >
          {itemSetList.map((set, i) => (
            <div
              key={i}
              className="Carousel__ItemSet"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridGap: `${gap}px`
              }}
            >
              {set}
            </div>
          ))}
        </div>
      </div>
      <span
        className="Carousel__btn--next"
        hidden={currentPage === page - 1}
        onClick={handleNext}
      />
    </div>
  )
}

Carousel.Item = ({ children }) => children
Carousel.Item.displayName = CAROUSEL_ITEM
export default Carousel
