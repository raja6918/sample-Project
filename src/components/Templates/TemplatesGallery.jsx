import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import IconButton from '@material-ui/core/IconButton';
import Icon from '../Icon';
import DataNotFound from '../DataNotFound';
import TemplateCard from './TemplateCard';
import { perfectScrollConfig } from '../../utils/common';

import _ from 'lodash';

const Container = styled.div`
  background-color: #fafafa;
  -webkit-overflow-scrolling: ${({ full }) => (full ? 'hidden' : 'touch')};
  height: ${({ full }) => (full ? '100vh' : 'calc(100vh - 134px)')};
`;

const HeaderContainer = styled.div`
  background-color: #004c8c;
  color: #fff;
  padding: 3px 0;
  & p,
  & button {
    display: inline-block;
    vertical-align: top;
  }
  & p {
    margin: 0;
    font-size: 20px;
    line-height: 48px;
  }
`;

const TemplatesGrid = styled.div`
  text-align: center;
  max-height: ${({ full }) => (full ? 'calc(100vh - 34px)' : null)};
  margin: 0 auto;
`;

const totalCardWidth = 340;

const GalleryTitle = styled.p`
  padding: 0;
  display: inline-block;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 400;
  margin: 0;
  padding: 23px 0;
`;

class TemplatesGallery extends React.Component {
  state = {
    emptyCells: [],
  };

  componentDidMount() {
    this.setEmptyCells();
    window.addEventListener('resize', this.setEmptyCells);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setEmptyCells);
  }

  componentDidUpdate(prevProps) {
    this.setEmptyCells();
    const currentData = this.props.templates;
    const oldData = prevProps.templates;

    if (currentData.length - oldData.length === 1) {
      const newItem = _.differenceBy(currentData, oldData, 'id')[0];
      if (newItem) {
        const element = document.getElementById(`template-${newItem.id}`);
        if (element) {
          element.scrollIntoView(true);
        }
      }
    }
  }

  setEmptyCells = () => {
    if (this.props.templates.length > 0) {
      const containerWidth = this.grid.clientWidth;
      const cardWidth = totalCardWidth;
      const rowNumber = Math.floor(containerWidth / cardWidth);
      const aux = this.props.templates.length % rowNumber;
      const left = aux === 0 || isNaN(aux) ? 0 : rowNumber - aux;

      if (this.state.emptyCells.length !== left) {
        const aux = [];
        for (let i = 0; i < left; i++) {
          aux.push({});
        }
        this.setState({ emptyCells: aux });
      }
    }
  };

  render() {
    const { emptyCells } = this.state;
    const {
      t,
      handleClose,
      handleClick,
      templates,
      drawer = true,
      paddingTop,
      scopes,
      ...rest
    } = this.props;

    return (
      <Container full={drawer}>
        {drawer && (
          <HeaderContainer>
            <IconButton onClick={handleClose} style={{ padding: '12px' }}>
              <Icon margin={'0'} iconcolor={'#FFF'}>
                arrow_back
              </Icon>
            </IconButton>
            <p>{t('TEMPLATES.galleryTitle')}</p>
          </HeaderContainer>
        )}
        {drawer && (
          <div
            style={{
              padding: '0 24px',
            }}
          >
            <GalleryTitle>{t('TEMPLATES.select')}</GalleryTitle>
          </div>
        )}

        {templates.length > 0 && (
          <TemplatesGrid
            full={drawer}
            style={{ paddingTop }}
            innerRef={node => (this.grid = node)}
          >
            {' '}
            <PerfectScrollbar option={perfectScrollConfig}>
              <div
                style={{
                  height: drawer
                    ? 'calc(100vh - 135px)'
                    : 'calc(100vh - 133px)',
                }}
              >
                <div>
                  {templates.map((item, index) => (
                    <TemplateCard
                      handleClick={handleClick}
                      index={index}
                      key={item.id}
                      t={t}
                      template={item}
                      scopes={scopes}
                      {...rest}
                    />
                  ))}
                  {emptyCells.map((item, index) => (
                    <div
                      style={{
                        width: `${totalCardWidth}px`,
                        display: 'inline-block',
                      }}
                      key={index}
                    />
                  ))}{' '}
                </div>
              </div>
            </PerfectScrollbar>
          </TemplatesGrid>
        )}

        {templates.length < 1 && (
          <DataNotFound
            text={t('GLOBAL.dataNotFound.message', {
              data: t('TEMPLATES.title').toLowerCase(),
            })}
          />
        )}
      </Container>
    );
  }
}

TemplatesGallery.propTypes = {
  t: PropTypes.func.isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleClose: PropTypes.func,
  handleClick: PropTypes.func,
  drawer: PropTypes.bool,
  paddingTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  scopes: PropTypes.shape({
    add: PropTypes.arrayOf(PropTypes.string),
    delete: PropTypes.arrayOf(PropTypes.string),
    view: PropTypes.arrayOf(PropTypes.string),
  }),
};

TemplatesGallery.defaultProps = {
  handleClick: () => {},
  handleClose: () => {},
  drawer: true,
  paddingTop: 0,
  scopes: {},
};
export default TemplatesGallery;
