
import * as React from "react";
import { DayProps } from "react-day-picker";

declare module "react-day-picker" {
  export interface ModifiersStyles {
    hasLogs?: React.CSSProperties;
  }

  export interface DayModifiers {
    hasLogs?: (date: Date) => boolean;
  }
}
