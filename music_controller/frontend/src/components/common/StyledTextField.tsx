import styled from "@emotion/styled";
import {
  inputLabelClasses,
  outlinedInputClasses,
  TextField,
} from "@mui/material";
import colorScheme from "../../utility/colorScheme";

export const StyledTextField = styled(TextField)`
  flex-grow: 1;

  ${"&:hover fieldset"} {
    border-color: ${`${colorScheme.gray}!important`};
  }

  ${"& .MuiOutlinedInput-notchedOutline"} {
    border-color: ${`${colorScheme.gray}!important`};
  }

  ${`& .${outlinedInputClasses.input}`} {
    color: ${colorScheme.gray};
  }

  ${`& .${inputLabelClasses.root}`} {
    color: ${colorScheme.gray};
  }
`;
