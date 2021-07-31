import dateFnsGenerateConfig from "../utils/generateDateFns";
import generatePicker from "antd/es/date-picker/generatePicker";
import "antd/es/date-picker/style/index";

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

export default DatePicker;
