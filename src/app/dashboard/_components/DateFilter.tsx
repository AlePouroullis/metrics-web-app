import { FormHelperText, IconButton, Popover } from "@mui/material";
import {
  CalendarIcon,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRef, useState } from "react";
import styles from "./DateFilter.module.scss";
import { Dayjs } from "dayjs";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { DateRange } from "@mui/icons-material";

enum DateFilterType {
  IN_THE_LAST = "is in the last",
  BETWEEN = "is between",
  ON_OR_AFTER = "is on or after",
  BEFORE = "is before",
  EQUAL = "is equal to",
}

enum DateFilterUnit {
  HOURS = "hours",
  DAYS = "days",
  WEEKS = "weeks",
  MONTHS = "months",
}

const commonDatePickerProps = {
  sx: {
    "& .MuiInputBase-input": { padding: "5px" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#979797" }, //styles the label
    "& .MuiOutlinedInput-root": {
      "&:hover > fieldset": { borderColor: "#C7C8CD" },

      borderRadius: "6px",
      fontSize: "14px",
    },
  },
  slotProps: {
    textField: {
      InputProps: {
        startAdornment: <CalendarIcon sx={{ fontSize: "14px" }} />,
        endAdornment: null,
      },
    },
  },
};

type Props = {
  disabled?: boolean;
};

export default function DateFilter({ disabled }: Props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [betweenDate, setBetweenDate] = useState<(Dayjs | null)[]>([
    null,
    null,
  ]);
  const [unit, setUnit] = useState<DateFilterUnit>(DateFilterUnit.DAYS);
  const [quantity, setQuantity] = useState<number>(1);
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>(
    DateFilterType.IN_THE_LAST
  );
  const widgetRef = useRef<HTMLDivElement>(null);

  const renderInputBasedOnFilterType = () => {
    switch (dateFilterType) {
      case DateFilterType.BETWEEN:
        return (
          <div className={styles.datePickerMultiple}>
            <DatePicker
              {...commonDatePickerProps}
              value={betweenDate[0]}
              onChange={(newDate) => setBetweenDate([newDate, betweenDate[1]])}
            />
            <span className={styles.separator}>-</span>
            <DatePicker
              {...commonDatePickerProps}
              value={betweenDate[1]}
              onChange={(newDate) => setBetweenDate([betweenDate[0], newDate])}
            />
          </div>
        );
      case DateFilterType.IN_THE_LAST:
        return (
          <div className={styles.inlineInputs}>
            <div className={styles.inputWrapper}>
              <input
                id="quantity-input"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as DateFilterUnit)}
            >
              {Object.values(DateFilterUnit).map((unit) => (
                <option key={unit} value={unit}>
                  {unit.toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return (
          <DatePicker
            label="Date"
            value={selectedDate}
            onChange={setSelectedDate}
          />
        );
    }
  };

  /**
   * Checks if the date filter is set
   */
  const isSet = () => {
    switch (dateFilterType) {
      case DateFilterType.BETWEEN:
        return betweenDate[0] !== null && betweenDate[1] !== null;
      case DateFilterType.IN_THE_LAST:
        return quantity > 0;
      default:
        return selectedDate !== null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        ref={widgetRef}
        onClick={() => setPopoverOpen(true)}
        className={styles.dateFilterWidget}
        // Disable the widget if the component is disabled. Grey out if disabled
        style={{
          pointerEvents: disabled ? "none" : "auto",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <IconButton className={styles.clearDateButton}>
          <ClearRoundedIcon className={styles.icon} />
        </IconButton>
        <span className={styles.text}>Date Filter</span>
        <DateRange className={`${styles.icon} ${styles.calendarIcon}`} />
      </div>
      <Popover
        open={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        anchorEl={widgetRef?.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <div className={styles.popoverContent}>
          <h2 className={styles.header}>Filter by date</h2>
          <div className={styles.top}>
            <select
              value={dateFilterType}
              onChange={(event) =>
                setDateFilterType(event.target.value as DateFilterType)
              }
            >
              {Object.values(DateFilterType).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ").toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.bottom}>{renderInputBasedOnFilterType()}</div>
        </div>
      </Popover>
    </LocalizationProvider>
  );
}
