import Image from 'next/image';

export interface LogoProps {
  width?: number;
  height?: number;
  reverse?: boolean;
}

export function Logo({ width = 220, height = 220, reverse = false }: LogoProps) {
  const logo = reverse ? '/logoReverse.svg' : '/thumb.svg';
  return <Image src={logo} width={width} height={height} alt="Logo" />;
}
