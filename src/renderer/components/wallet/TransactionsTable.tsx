import React, { useMemo, useCallback, useRef } from 'react'

import * as RD from '@devexperts/remote-data-ts'
import { baseToAsset, formatAssetAmount } from '@thorchain/asgardex-util'
import { Grid, Col, Row } from 'antd'
import { ColumnsType, ColumnType } from 'antd/lib/table'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { ordString } from 'fp-ts/lib/Ord'
import { useIntl, FormattedDate, FormattedTime } from 'react-intl'

import { ZERO_BN } from '../../const'
import { MAX_ITEMS_PER_PAGE } from '../../services/const'
import { ApiError, AssetTx, AssetTxs, AssetTxsPage, AssetTxsPageRD } from '../../services/wallet/types'
import ErrorView from '../shared/error/ErrorView'
import Pagination from '../uielements/Pagination'
import * as Styled from './TransactionTable.style'

type Props = {
  txsPageRD: AssetTxsPageRD
  clickTxLinkHandler: (txHash: string) => void
  changePaginationHandler: (page: number) => void
}
const TransactionsTable: React.FC<Props> = (props): JSX.Element => {
  const { txsPageRD, clickTxLinkHandler, changePaginationHandler } = props
  const intl = useIntl()
  const isDesktopView = Grid.useBreakpoint()?.lg ?? false

  // store previous data of Txs to render these while reloading
  const previousTxs = useRef<O.Option<AssetTxsPage>>(O.none)

  const renderTypeColumn = useCallback((_, { type }: AssetTx) => {
    switch (type) {
      case 'freeze':
        return <Styled.FreezeIcon />
      case 'unfreeze':
        return <Styled.UnfreezeIcon />
      case 'transfer':
        return <Styled.TransferIcon />
      default:
        return <></>
    }
  }, [])

  const typeColumn: ColumnType<AssetTx> = {
    key: 'txType',
    title: '',
    align: 'center',
    width: 60,
    render: renderTypeColumn,
    sortDirections: ['descend', 'ascend']
  }

  const renderFromColumn = useCallback((_, { from }: AssetTx) => <Styled.Text>{from}</Styled.Text>, [])
  const fromColumn: ColumnType<AssetTx> = {
    key: 'fromAddr',
    title: intl.formatMessage({ id: 'common.from' }),
    align: 'left',
    ellipsis: true,
    render: renderFromColumn,
    sorter: (a: AssetTx, b: AssetTx) => ordString.compare(a.from, b.from),
    sortDirections: ['descend', 'ascend']
  }

  const renderToColumn = useCallback(
    (_, { to }: AssetTx) => (
      <>
        {to.map(({ address }) => (
          <Styled.Text key={address}>{address}</Styled.Text>
        ))}
      </>
    ),
    []
  )

  const toColumn: ColumnType<AssetTx> = {
    key: 'toAddr',
    title: intl.formatMessage({ id: 'common.to' }),
    align: 'left',
    ellipsis: true,
    render: renderToColumn,
    sorter: ({ to: toA }: AssetTx, { to: toB }: AssetTx) =>
      // For simplicity we sort first item only
      // TODO (@Veado) Play around to get a user-friendly sort option
      ordString.compare(toA[0]?.address ?? '', toB[0]?.address ?? ''),
    sortDirections: ['descend', 'ascend']
  }

  const renderDateColumn = useCallback(
    (_, { date }: AssetTx) => (
      <Row gutter={[8, 0]}>
        <Col>
          <Styled.Text>
            <FormattedDate
              year={isDesktopView ? 'numeric' : '2-digit'}
              month={isDesktopView ? '2-digit' : 'numeric'}
              day={isDesktopView ? '2-digit' : 'numeric'}
              value={date}
            />
          </Styled.Text>
        </Col>
        <Col>
          <Styled.Text>
            <FormattedTime hour="2-digit" minute="2-digit" second="2-digit" hour12={false} value={date} />
          </Styled.Text>
        </Col>
      </Row>
    ),
    [isDesktopView]
  )

  const dateColumn: ColumnType<AssetTx> = {
    key: 'timeStamp',
    title: intl.formatMessage({ id: 'common.date' }),
    align: 'left',
    width: isDesktopView ? 200 : 180,
    render: renderDateColumn,
    sorter: (a: AssetTx, b: AssetTx) => a.date.getTime() - b.date.getTime(),
    sortDirections: ['descend', 'ascend'],
    defaultSortOrder: 'descend'
  }

  const renderAmountColumn = useCallback(
    (_, { to }: AssetTx) => (
      <>
        {to.map(({ amount, address }) => (
          <Styled.Text key={address}>{formatAssetAmount({ amount: baseToAsset(amount), trimZeros: true })}</Styled.Text>
        ))}
      </>
    ),
    []
  )

  const amountColumn: ColumnType<AssetTx> = {
    key: 'value',
    title: intl.formatMessage({ id: 'common.amount' }),
    align: 'left',
    render: renderAmountColumn,
    sorter: ({ to: toA }: AssetTx, { to: toB }: AssetTx) =>
      // For simplicity we sort first item only
      // TODO (@Veado) Play around to get a user-friendly sort option
      (toA[0]?.amount.amount() ?? ZERO_BN).comparedTo(toB[0]?.amount.amount() ?? ZERO_BN),
    sortDirections: ['descend', 'ascend']
  }

  const renderLinkColumn = useCallback(
    ({ hash }: AssetTx) => <Styled.LinkIcon onClick={() => clickTxLinkHandler(hash)} />,
    [clickTxLinkHandler]
  )
  const linkColumn: ColumnType<AssetTx> = {
    key: 'txHash',
    title: '',
    align: 'center',
    width: 60,
    render: renderLinkColumn
  }

  const desktopColumns: ColumnsType<AssetTx> = [typeColumn, fromColumn, toColumn, dateColumn, amountColumn, linkColumn]

  const mobileColumns: ColumnsType<AssetTx> = [typeColumn, amountColumn, dateColumn, linkColumn]

  const renderTable = useCallback(
    ({ total, txs }: AssetTxsPage, loading = false) => {
      const columns = isDesktopView ? desktopColumns : mobileColumns
      return (
        <>
          <Styled.Table columns={columns} dataSource={txs} loading={loading} rowKey="hash" />
          {total > 0 && (
            <Pagination
              defaultCurrent={1}
              total={total}
              defaultPageSize={MAX_ITEMS_PER_PAGE}
              showSizeChanger={false}
              onChange={changePaginationHandler}
            />
          )}
        </>
      )
    },
    [desktopColumns, isDesktopView, mobileColumns, changePaginationHandler]
  )

  const emptyTableData = useMemo((): AssetTxsPage => ({ total: 0, txs: [] as AssetTxs }), [])

  const renderContent = useMemo(
    () => (
      <>
        {RD.fold(
          () => renderTable(emptyTableData, true),
          () => {
            const data = FP.pipe(
              previousTxs.current,
              O.getOrElse(() => emptyTableData)
            )
            return renderTable(data, true)
          },
          ({ msg }: ApiError) => <ErrorView title={msg} />,
          (data: AssetTxsPage): JSX.Element => {
            previousTxs.current = O.some(data)
            return renderTable(data)
          }
        )(txsPageRD)}
      </>
    ),
    [txsPageRD, renderTable, emptyTableData]
  )

  return renderContent
}
export default TransactionsTable
