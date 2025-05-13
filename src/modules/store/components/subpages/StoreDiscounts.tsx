import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import { format, parseISO } from "date-fns";

interface Discount {
  id: number;
  name: string;
  percent: number;
  start: string;
  end: string;
}

const TODAY_ISO = format(new Date(), "yyyy-MM-dd");

const StoreDiscounts: React.FC<{ storeId?: string }> = ({ storeId }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: 1,
      name: "Winter Sale",
      percent: 20,
      start: "2024-12-01",
      end: "2027-12-31",
    },
  ]);

  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    start: TODAY_ISO,
  });
  const [showForm, setShowForm] = useState(false);

  const toDisplayDate = (iso?: string) =>
    iso ? format(parseISO(iso), "dd/MM/yyyy") : "";

  const handleAdd = () => {
    if (
      !newDiscount.name ||
      newDiscount.percent === undefined ||
      newDiscount.percent < 1 ||
      !newDiscount.end
    ) {
      alert("Please fill all fields and ensure percent is at least 1.");
      return;
    }

    if (parseISO(newDiscount.end) < parseISO(newDiscount.start!)) {
      alert("End date must be on or after the start date.");
      return;
    }

    const next: Discount = {
      id: discounts.length + 1,
      name: newDiscount.name,
      percent: newDiscount.percent,
      start: newDiscount.start!,
      end: newDiscount.end,
    };

    setDiscounts((prev) => [...prev, next]);
    setNewDiscount({ start: TODAY_ISO });
    setShowForm(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <Box
        width="100%"
        px={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h5" fontWeight={700} color="primary" mb={3}>
          🏷️ Store Discounts
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
          sx={{ mb: 4 }}
        >
          ➕ Add Discount
        </Button>

        {/* ✅ Dialog for discount form */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Discount</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Discount Name"
                variant="outlined"
                fullWidth
                value={newDiscount.name || ""}
                onChange={(e) =>
                  setNewDiscount({ ...newDiscount, name: e.target.value })
                }
              />

              <TextField
                label="Percent"
                type="number"
                variant="outlined"
                fullWidth
                inputProps={{ min: 1, max: 100 }}
                value={newDiscount.percent ?? ""}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    percent: parseFloat(e.target.value),
                  })
                }
              />

              <TextField
                label="Start Date"
                variant="outlined"
                fullWidth
                disabled
                value={toDisplayDate(newDiscount.start)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { textAlign: "left" } }}
              />

              <DatePicker
                label="End Date"
                format="dd/MM/yyyy"
                minDate={parseISO(newDiscount.start!)}
                value={newDiscount.end ? parseISO(newDiscount.end) : null}
                onChange={(date: Date | null) =>
                  setNewDiscount({
                    ...newDiscount,
                    end: date ? format(date, "yyyy-MM-dd") : undefined,
                  })
                }
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAdd}>
              Save Discount
            </Button>
          </DialogActions>
        </Dialog>

        <Box width="100%" maxWidth="800px">
          <Stack spacing={2}>
            {discounts.map((d) => (
              <Paper
                key={d.id}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "blue.50",
                }}
                elevation={1}
              >
                <Box>
                  <Typography fontWeight={600} color="primary">
                    {d.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {d.percent}% off
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {toDisplayDate(d.start)} → {toDisplayDate(d.end)}
                  </Typography>
                </Box>
                <Typography fontWeight={700} color="primary" variant="h6">
                  {d.percent}%
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default StoreDiscounts;
