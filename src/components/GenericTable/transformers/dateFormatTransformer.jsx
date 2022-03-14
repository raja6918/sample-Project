import moment from 'moment';

const formatDate = date => {
  if (!date) return null;
  return moment(date).format('DD/MM/Y');
};

const dateFormatTransformer = date => {
  return formatDate(date);
};

export default dateFormatTransformer;
