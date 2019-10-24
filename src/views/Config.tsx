import React, { useState } from 'react'

const Config = () => {
  const [info, setInfo] = useState({ age: 1 })
  const add = () => {
    setInfo((info: any) => {
      return {    //  需要返回新的对象
        age: ++ info.age
      }
    })
  }
  return (
    <div>
      <div>{info.age}</div>
      <button onClick={add}>点击</button>
    </div>
  )
}

export default Config