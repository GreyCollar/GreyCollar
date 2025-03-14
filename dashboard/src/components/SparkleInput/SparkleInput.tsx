import { IconButton, InputAdornment, SvgIcon, TextField } from "@mui/material";

export default function SparkleInput({
  prop,
  onChange,
  onRandomValue,
  value,
  multiline,
  ...others
}) {
  return (
    <TextField
      inputProps={{
        "data-cy": prop,
        style: { textAlign: "left" },
      }}
      autoFocus
      margin="dense"
      label={prop}
      fullWidth
      value={value || ""}
      multiline={multiline}
      onChange={onChange}
      dir="ltr"
      InputLabelProps={{
        sx: { color: (theme) => theme.palette.text.primary },
      }}
      style={{ direction: "ltr" }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={onRandomValue}
              sx={multiline ? { marginRight: 1 } : {}}
            >
              <SvgIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="white"
                    d="M7.398 12.809a1.042 1.042 0 0 0 1.204-.003c.178-.13.313-.31.387-.518l.447-1.373a2.336 2.336 0 0 1 1.477-1.479l1.391-.45a1.045 1.045 0 0 0-.044-1.98l-1.375-.448a2.335 2.335 0 0 1-1.48-1.477l-.452-1.388a1.044 1.044 0 0 0-1.973.017l-.457 1.4a2.336 2.336 0 0 1-1.44 1.45l-1.39.447a1.045 1.045 0 0 0 .016 1.974l1.374.445a2.333 2.333 0 0 1 1.481 1.488l.452 1.391c.072.204.206.38.382.504m.085-7.415l.527-1.377l.44 1.377a3.331 3.331 0 0 0 2.117 2.114l1.406.53l-1.382.447a3.344 3.344 0 0 0-2.115 2.117l-.523 1.378l-.449-1.379a3.336 3.336 0 0 0-.8-1.31a3.373 3.373 0 0 0-1.312-.812l-1.378-.522l1.386-.45a3.358 3.358 0 0 0 1.29-.813a3.4 3.4 0 0 0 .793-1.3m6.052 11.457a.806.806 0 0 0 1.226-.398l.248-.762a1.09 1.09 0 0 1 .26-.42c.118-.12.262-.208.42-.26l.772-.252a.8.8 0 0 0-.023-1.52l-.764-.25a1.075 1.075 0 0 1-.68-.678l-.252-.773a.8.8 0 0 0-1.518.01l-.247.762a1.068 1.068 0 0 1-.665.679l-.773.252a.8.8 0 0 0 .008 1.518l.763.247c.16.054.304.143.422.261c.119.119.207.263.258.422l.253.774a.8.8 0 0 0 .292.388m-.913-2.793L12.443 14l.184-.064a2.11 2.11 0 0 0 1.3-1.317l.058-.178l.06.181a2.078 2.078 0 0 0 1.316 1.316l.195.063l-.18.06a2.076 2.076 0 0 0-1.317 1.32l-.059.181l-.058-.18a2.075 2.075 0 0 0-1.32-1.323"
                  />
                </svg>
              </SvgIcon>
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        textTransform: "capitalize",
      }}
      {...others}
    />
  );
}
