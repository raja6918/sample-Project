import React from 'react';
import { mount, shallow } from 'enzyme';

import TemplateGallery from '../TemplatesGallery';

const t = jest.fn();
const handleClose = jest.fn();

const templates = [
  {
    id: '1',
    name: 'Standard Template',
    category: 'Pairing',
    createdBy: 'AD OPT',
    lastModified: '2017-12-04T08:30:00.586Z'
  },
  {
    id: '2',
    name: '2018 Pilot Negotiations',
    category: 'Pairing',
    createdBy: 'Fred Smith',
    lastModified: '2018-03-12T08:30:00.586Z'
  },
  {
    id: '3',
    name: 'New Regulations',
    category: 'Pairing',
    createdBy: 'Zev Levy',
    lastModified: '2018-08-18T08:30:00.586Z'
  },
  {
    id: '4',
    name: 'Summer Sched',
    category: 'Pairing',
    createdBy: 'Abdel Hashemi',
    lastModified: '2018-02-21T08:30:00.586Z'
  },
  {
    id: '5',
    name: 'Winter Sched',
    category: 'Pairing',
    createdBy: 'Claudia Leroux',
    lastModified: '2018-02-17T08:30:00.586Z'
  },
  {
    id: '6',
    name: 'Blank',
    category: 'Pairing',
    createdBy: 'AD OPT',
    lastModified: '2018-05-21T08:30:00.586Z'
  }
];

test('TemplateGallery Render', () => {});
