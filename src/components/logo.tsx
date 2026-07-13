import Image from 'next/image';

/**
 * The Ajdam mark, recoloured to the single blue.
 *
 * The original is a bicultural calligram: Latin and Arabic letterforms fused,
 * set on a saffron slab, with two red strokes slicing vertically through it.
 * Recoloured, the slab becomes the blue laid down as a field and the strokes
 * become the blue at full strength. The letterforms stay ink. Nothing else
 * changed, because nothing else needed to.
 *
 * `variant="dark"` swaps the ink letterforms for paper, for use on the deep
 * ink surface in the footer and the call to action.
 */
export function Logo({
  variant = 'light',
  size = 44,
  className = '',
  priority = false,
}: {
  variant?: 'light' | 'dark';
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === 'dark' ? '/logo-mark-dark.png' : '/logo-mark.png'}
      alt="Ajdaam Machine Craft"
      width={size}
      height={size}
      priority={priority}
      className={className}
    />
  );
}
