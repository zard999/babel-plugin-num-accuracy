/*
 * @Author: zyh
 * @Date: 2023-08-16 11:19:19
 * @LastEditors: zyh
 * @LastEditTime: 2023-08-16 11:23:17
 * @FilePath: /npm-sx-test/src/index.js
 * @Description: 精度计算
 * 
 * Copyright (c) 2023 by 穿越, All Rights Reserved. 
 */
// 定义构造函数的名称常量
const DECIMAL_FUN_NAME = 'Decimal'
// 运算符号映射 decimal.js 的四个方法
const OPERATIONS_MAP = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div'
}
// 运算符号数组
const OPERATIONS = Object.keys(OPERATIONS_MAP)

export default function ({ template: template }) {

  // require decimal.js 的节点模板
  const requireDecimalTemp = template(`const ${DECIMAL_FUN_NAME}=require('decimal.js')`);
  // 将运算表达式转换为decimal函数的节点模板
  const operationTemp = template(`new ${DECIMAL_FUN_NAME}(LEFT).OPERATION(RIGHT).toNumber()`);

  return {
    visitor: {
      Program: {
        exit: function (path) {
          // 调用方法，往子节点body
          // 中插入 const Decimal = require('decimal.js')
          // 表达式
          path.unshiftContainer("body",
            requireDecimalTemp())
        }
      },
      BinaryExpression: {
        exit: function (path) {
          const operator = path.node.operator;
          if (OPERATIONS.includes(operator)) {
            // 调用方法替换节点
            path.replaceWith(
              // 传入 operator left right
              operationTemp({
                LEFT: path.node.left,
                RIGHT: path.node.right,
                OPERATION: OPERATIONS_MAP[operator]
              })
            )
          }
        }
      }
    }
  }
}
