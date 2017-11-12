import { TAttributeName } from './attribute-name';

const permission = {
  resource: 'dealer:booking',
  action: 'list',
  effect: 'allow',
  attributes: {
    number_lte_if_exists: {
      'query.limit': '100'
    },

  }
};


const environment = {
  query: { limit: 10 },

};

export type TAttributesHash = {
  [name: string]: TAttributeName[];
};