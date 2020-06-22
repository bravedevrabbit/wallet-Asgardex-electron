import React, { useCallback } from 'react'

import Icon, { TwitterOutlined, GithubOutlined, BranchesOutlined, BugOutlined } from '@ant-design/icons'
import { Row, Col, Grid } from 'antd'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'

import { ReactComponent as TelegramIcon } from '../assets/svg/icon-telegram.svg'
import { ReactComponent as ThorChainIcon } from '../assets/svg/logo-thorchain.svg'
import * as playgroundRoutes from '../routes/playground'
import { FooterContainer, FooterLink, FooterIconWrapper, FooterLinkWrapper } from './Footer.style'

const { shell } = window.require('electron')

type IconProps = {
  url: string
  children: React.ReactNode
}

const FooterIcon: React.FC<IconProps> = (props: IconProps): JSX.Element => {
  const { children, url } = props

  const clickHandler = useCallback(() => {
    shell.openExternal(url)
  }, [url])

  return <FooterIconWrapper onClick={clickHandler}>{children}</FooterIconWrapper>
}

type Props = {
  commitHash?: string
}

const Footer: React.FC<Props> = (props: Props): JSX.Element => {
  const { commitHash } = props

  const intl = useIntl()

  const history = useHistory()
  const screens = Grid.useBreakpoint()

  const gotoPlayground = useCallback(() => history.push(playgroundRoutes.base.path()), [history])

  return (
    <FooterContainer>
      <Row justify="space-between" align="middle">
        <Col span={24} md={4}>
          <Row justify={screens.md ? 'start' : 'center'}>
            <FooterIcon url="https://thorchain.org">
              <ThorChainIcon />
            </FooterIcon>
          </Row>
        </Col>
        <Col span={24} md={14}>
          <FooterLinkWrapper justify="center">
            <FooterLink to="/stats">{intl.formatMessage({ id: 'common.stats' })}</FooterLink>
            <FooterLink to="/network">{intl.formatMessage({ id: 'common.network' })}</FooterLink>
            <FooterLink to="/faqs">{intl.formatMessage({ id: 'common.faqs' })}</FooterLink>
          </FooterLinkWrapper>
        </Col>
        <Col span={24} md={6}>
          <Row justify={screens.md ? 'end' : 'center'}>
            <FooterIcon url="https://twitter.com/thorchain_org">
              <TwitterOutlined />
            </FooterIcon>
            <FooterIcon url="https://t.me/thorchain_org">
              <Icon component={TelegramIcon} />
            </FooterIcon>
            <FooterIcon url="https://github.com/thorchain">
              <GithubOutlined />
            </FooterIcon>
            {commitHash && (
              <FooterIcon url={`https://github.com/thorchain/asgardex-electron/commit/${commitHash}`}>
                <BranchesOutlined />
              </FooterIcon>
            )}
            {/* TODO (@Veado) Just for debugging - Remove it if we don't need it anymore */}
            <FooterIconWrapper onClick={gotoPlayground}>
              <BugOutlined />
            </FooterIconWrapper>
          </Row>
        </Col>
      </Row>
    </FooterContainer>
  )
}

export default Footer
