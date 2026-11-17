import { Anchor, type AnchorProps } from '@mantine/core';
import { Link } from 'react-router';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface AppLinkProps extends Omit<AnchorProps, 'href'> {
  to: string;
  children: ReactNode;
}

export function AppLink({ to, children, ...props }: AppLinkProps) {
  return (
    <Anchor
      renderRoot={(anchorProps: ComponentPropsWithoutRef<'a'>) => (
        <Link to={to} {...anchorProps} />
      )}
      {...props}
    >
      {children}
    </Anchor>
  );
}