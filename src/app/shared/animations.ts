import { trigger, state, transition, style, group, animate, query } from '@angular/animations';


export const fadeInOut =
  trigger('fadeInOut', [
    transition('* <=> *', [
      query(':enter, :leave', style({ opacity: 1 })),
      group([
        query(':enter', [
          style({ opacity: 0 }),
          animate('1s ease-in-out', style({ opacity: 1 }))
        ], { optional: true }),
        query(':leave', [
          style({ opacity: 1 }),
          animate('1s ease-in-out', style({ opacity: 0 }))
        ], { optional: true }),
      ])
    ])
  ])

export const fadeIn =
  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('1s ease-in-out', style({ opacity: 1 }))
    ]),

  ]);
export const fadeOut =
  trigger('fadeOut', [
    transition(':leave', [
      style({ opacity: 1 }),
      animate('1s', style({ opacity: 0 }))
    ])
  ]);

export const fadeInDown = [
  trigger('fadeInDown', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translate3d(0, -100%, 0)' }),
      animate('1s ease-in-out', style({ opacity: 1, transform: 'none' }))
    ]),
  ])
];

export const fadeInUp = [
  trigger('fadeInUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translate3d(0, 100%, 0)' }),
      animate('1s ease-in-out', style({ opacity: 1, transform: 'none' }))
    ]),
  ])
];

export const fadeOutDown = [
  trigger('fadeOutDown', [
    transition(':leave', [
      style({ opacity: 1 }),
      animate('1s ease-in', style({ opacity: 0, transform: 'translate3d(0, 100 %, 0)' }))
    ])
  ])
];

export const fadeOutUp = [
  trigger('fadeOutUp', [
    transition(':leave', [
      style({ opacity: 1 }),
      animate('1s ease-in', style({ opacity: 0, transform: 'translate3d(0, -100 %, 0)' }))
    ])
  ])
];

export const shrinkX =
  trigger('shrinkX', [
    transition(':enter', [
      style({ transform: 'scaleX(0)' }),
      animate('.4s ease-in-out', style({ transform: 'scaleX(1)' }))
    ]),
    transition(':leave', [
      style({ transform: 'scaleX(1)' }),
      animate('.4s ease-in', style({ transform: 'scaleX(0)' }))
    ])
  ]);

export const shrinkY =
  trigger('shrinkY', [
    state('show', style({
      transform: 'scaleY(1)'
    })),
    state('hide', style({
      transform: 'scaleY(0)',
      display: 'none',
      'transform-origin':  'top'
    })),
    transition('show => hide', animate('600ms ease-out')),
    transition('hide => show', animate('1000ms ease-in'))
  ]);


export const slideLeft =
  trigger('slideLeft', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)' }),
      animate('.2s', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0)' }),
      animate('.2s', style({ transform: 'translateX(-100%)' }))
    ]),
  ]);

export const slideRight =
  trigger('slideRight', [
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('.2s', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0)' }),
      animate('.2s', style({ transform: 'translateX(100%)' }))
    ]),
  ]);

export const slideUp =
  trigger('slideUp', [
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('.2s', style({ transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0)' }),
      animate('.2s', style({ transform: 'translateY(100%)' }))
    ]),
  ]);

export const fall =
  trigger('fall', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)' }),
      animate('.2s', style({ transform: 'translateY(0)' }))
    ]),
    transition(':enter', [
      style({ transform: 'translateY(0)' }),
      animate('.2s', style({ transform: 'translateY(-100%)' }))
    ]),
  ]);




