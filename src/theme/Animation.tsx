import animations from '@/assets/animations';
import Lottie, { LottieComponentProps } from 'lottie-react';

export interface AnimationProps extends Omit<LottieComponentProps, 'animationData'> {
  title: keyof typeof animations;
}

export function Animation({ title, ...props }: AnimationProps) {
  return <Lottie animationData={animations[title]} {...props} />;
}
