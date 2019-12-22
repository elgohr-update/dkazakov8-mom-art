import React from 'react';

import { Text, TextProps } from './Text';

export function Textarea(props: TextProps) {
  return <Text {...props} isTextarea />;
}
