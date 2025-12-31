import Lottie, { LottieComponentProps } from 'lottie-react';

import animations from '@/assets/animations';

export interface AnimationProps extends Omit<LottieComponentProps, 'animationData'> {
  title: keyof typeof animations;
}

export function Animation({ title, ...props }: AnimationProps) {
  return <Lottie animationData={animations[title]} {...props} />;
}
