import styled from 'styled-components'
import { Property } from 'csstype'

type TFlexBoxAlign =
  | 'start'
  | 'center'
  | 'end'
  | 'start start'
  | 'start center'
  | 'start end'
  | 'center start'
  | 'center center'
  | 'center end'
  | 'end start'
  | 'end center'
  | 'end end'
  | undefined
interface IFlexBox {
  align?: TFlexBoxAlign
  wrap?: Property.FlexWrap
  grow?: Property.FlexGrow
}

const toJustifyContent = (align: TFlexBoxAlign = 'start') => {
  const alignment = align.split(' ')[0]
  return alignment === 'center' ? alignment : `flex-${alignment}`
}

const toAlignItems = (align: TFlexBoxAlign = 'start') => {
  const secondParam = align.split(' ')[1]
  const alignment = secondParam !== undefined ? secondParam : 'stretch'
  return alignment === 'center' || alignment === 'stretch'
    ? alignment
    : `flex-${alignment}`
}

export const FlexColumn = styled.div<IFlexBox>`
  display: flex;
  flex-flow: column ${({ wrap }) => wrap};
  flex-direction: column;
  justify-content: ${({ align }) => toJustifyContent(align)};
  align-items: ${({ align }) => toAlignItems(align)};
  ${({ grow }) => (grow ? `flex-grow: ${grow}` : '')};
`
FlexColumn.defaultProps = {
  align: 'start',
  wrap: 'nowrap',
  grow: undefined,
}

export const FlexRow = styled.div<IFlexBox>`
  display: flex;
  flex-flow: row ${({ wrap }) => wrap};
  justify-content: ${({ align }) => toJustifyContent(align)};
  align-items: ${({ align }) => toAlignItems(align)};
  ${({ grow }) => (grow ? `flex-grow: ${grow}` : '')};
`
FlexRow.defaultProps = {
  align: 'start',
  wrap: 'nowrap',
  grow: undefined,
}