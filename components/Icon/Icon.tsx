import Image from "next/image";
import styles from "./Icon.module.css";

const ICONS = {
  check: "/icons/check.svg",
  calendar: "/icons/calendar.svg",
  car: "/icons/car.svg",
  fuel: "/icons/fuel.svg",
  gear: "/icons/gear.svg",
  road: "/icons/road.svg",
  location: "/icons/location.svg",
  chevron: "/icons/chevron.svg",
  error: "/icons/error.svg",
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: 16 | 24;
  className?: string;
};

export function Icon({ name, size = 16, className }: IconProps) {
  const classes = [styles.icon, className].filter(Boolean).join(" ");

  return (
    <Image
      src={ICONS[name]}
      alt=""
      width={size}
      height={size}
      className={classes}
    />
  );
}
