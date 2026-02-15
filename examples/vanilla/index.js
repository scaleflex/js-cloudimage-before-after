import CIBeforeAfter from 'js-cloudimage-before-after';

new CIBeforeAfter('#slider', {
  beforeSrc:
    'https://scaleflex.cloudimg.io/v7/demo/before-after/living-room-before.jpg',
  afterSrc:
    'https://scaleflex.cloudimg.io/v7/demo/before-after/living-room-after.jpg',
  beforeAlt: 'Living room before renovation',
  afterAlt: 'Living room after renovation',
  mode: 'drag',
  labels: { before: 'Before', after: 'After' },
  zoom: true,
  theme: 'light',
  handleStyle: 'arrows',
  animate: { duration: 800 },
});
