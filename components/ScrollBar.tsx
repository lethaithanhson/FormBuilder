import { forwardRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import type { ScrollbarProps as ReactCustomScrollbarProps } from 'react-custom-scrollbars-2';

export declare namespace TypeAttributes {
    type Size = 'lg' | 'md' | 'sm' | 'xs';
    type Shape = 'round' | 'circle' | 'none';
    type Status = 'success' | 'warning' | 'danger' | 'info';
    type FormLayout = 'horizontal' | 'vertical' | 'inline';
    type ControlSize = 'lg' | 'md' | 'sm';
    type MenuVariant = 'light' | 'dark' | 'themed' | 'transparent';
    type Direction = 'ltr' | 'rtl';
  }

export interface ScrollbarProps extends ReactCustomScrollbarProps {
  direction?: TypeAttributes.Direction;
}

export type ScrollbarRef = Scrollbars;

const ScrollBar = forwardRef<ScrollbarRef, ScrollbarProps>((props, ref) => {
  const { direction = 'ltr', ...rest } = props;

  return (
    <Scrollbars
      ref={ref}
      renderView={(props) => (
        <div
          {...props}
          style={{
            ...props.style,
            ...(direction === 'rtl' && {
              marginLeft: props.style.marginRight,
              marginRight: 0,
            }),
          }}
        />
      )}
      {...rest}
    />
  );
});

ScrollBar.displayName = 'ScrollBar';

export default ScrollBar;
