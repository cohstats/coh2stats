import dateFnsGenerateConfig from "@rc-component/picker/lib/generate/dateFns";
import { DatePicker as AntdDatePicker } from "antd";

const DatePicker = AntdDatePicker.generatePicker<Date>(dateFnsGenerateConfig);

export default DatePicker;
