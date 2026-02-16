import CIBeforeAfter from 'js-cloudimage-before-after';

new CIBeforeAfter('#slider', {
  beforeSrc:
    'https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-before-after/landscape-before-vG4KL646.svg?vh=c20954',
  afterSrc:
    'https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-before-after/landscape-after-DbjDsLf5.svg?vh=6fafa4',
  beforeAlt: 'Living room before renovation',
  afterAlt: 'Living room after renovation',
  mode: 'drag',
  labels: { before: 'Before', after: 'After' },
  zoom: true,
  theme: 'light',
  handleStyle: 'arrows',
  animate: { duration: 800 },
});
