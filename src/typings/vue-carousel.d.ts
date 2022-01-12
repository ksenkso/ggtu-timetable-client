declare module 'vue-carousel' {
  export const Carousel = {
    props: {
      adjustableHeight: {
        type: Boolean,
        default: false
      },
      adjustableHeightEasing: {
        type: String
      },
      centerMode: {
        type: Boolean,
        default: false
      },
      easing: {
        type: String,
        validator: function(value) {
          return (
            ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'].indexOf(
              value
            ) !== -1 || value.includes('cubic-bezier')
          );
        },
        default: 'ease'
      },
      loop: {
        type: Boolean,
        default: false
      },
      minSwipeDistance: {
        type: Number,
        default: 8
      },
      mouseDrag: {
        type: Boolean,
        default: true
      },
      touchDrag: {
        type: Boolean,
        default: true
      },
      navigateTo: {
        type: [Number, Array],
        default: 0
      },
      navigationClickTargetSize: {
        type: Number,
        default: 8
      },
      navigationEnabled: {
        type: Boolean,
        default: false
      },
      navigationNextLabel: {
        type: String,
        default: '&#9654'
      },
      navigationPrevLabel: {
        type: String,
        default: '&#9664'
      },
      paginationActiveColor: {
        type: String,
        default: '#000000'
      },
      paginationColor: {
        type: String,
        default: '#efefef'
      },
      paginationEnabled: {
        type: Boolean,
        default: true
      },
      paginationPadding: {
        type: Number,
        default: 10
      },
      paginationPosition: {
        type: String,
        default: 'bottom'
      },
      paginationSize: {
        type: Number,
        default: 10
      },
      perPage: {
        type: Number,
        default: 2
      },
      perPageCustom: {
        type: Array
      },
      resistanceCoef: {
        type: Number,
        default: 20
      },
      scrollPerPage: {
        type: Boolean,
        default: true
      },
      spacePadding: {
        type: Number,
        default: 0
      },
      spacePaddingMaxOffsetFactor: {
        type: Number,
        default: 0
      },
      speed: {
        type: Number,
        default: 500
      },
      tagName: {
        type: String,
        default: 'slide'
      },
      value: {
        type: Number
      },
      maxPaginationDotCount: {
        type: Number,
        default: -1
      },
      rtl: {
        type: Boolean,
        default: false
      }
    }
  };

  export const Slide = {
    props: ['title']
  };

  export const Navigation = {
    props: {
      clickTargetSize: {
        type: Number,
        default: 8
      },
      nextLabel: {
        type: String,
        default: '&#9654'
      },
      prevLabel: {
        type: String,
        default: '&#9664'
      }
    }
  };
}
