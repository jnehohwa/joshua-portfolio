declare module 'lucide-react/dist/esm/icons/*.mjs' {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'

  type LucideIconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
    absoluteStrokeWidth?: boolean
    size?: number | string
  }

  const icon: ForwardRefExoticComponent<
    LucideIconProps & RefAttributes<SVGSVGElement>
  >

  export default icon
}
