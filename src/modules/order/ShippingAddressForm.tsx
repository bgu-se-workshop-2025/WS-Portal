import React from "react";
import { TextField, Stack } from "@mui/material";
import { ShippingAddressDto } from "../../shared/types/dtos";

interface Props {
  shippingAddress: ShippingAddressDto;
  onChange: (address: ShippingAddressDto) => void;
  disabled?: boolean;
}

const ShippingAddressForm: React.FC<Props> = ({ shippingAddress, onChange}) => {
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: fieldValue } = e.target;
    onChange({ ...shippingAddress, [name]: fieldValue });
  };

  return (
    <Stack spacing={2}>
        <TextField
            label="Country"
            name="country"
            value={shippingAddress.country}
            onChange={handleShippingChange}
            fullWidth
            />
            <TextField
            label="City"
            name="city"
            value={shippingAddress.city}
            onChange={handleShippingChange}
            fullWidth
            />
            <TextField
            label="Region"
            name="region"
            value={shippingAddress.region}
            onChange={handleShippingChange}
            fullWidth
            />
            <TextField
            label="Street"
            name="street"
            value={shippingAddress.street}
            onChange={handleShippingChange}
            fullWidth
            />
            <TextField
            label="Zip Code"
            name="zipCode"
            value={shippingAddress.zipCode}
            onChange={handleShippingChange}
            fullWidth
            />
            <TextField
            label="Home Number"
            name="homeNumber"
            value={shippingAddress.homeNumber}
            onChange={handleShippingChange}
            fullWidth
            />
            <TextField
            label="Apartment Number"
            name="apartmentNumber"
            value={shippingAddress.apartmentNumber}
            onChange={handleShippingChange}
            fullWidth
            />
            <TextField
            label="Mailbox"
            name="mailbox"
            value={shippingAddress.mailbox}
            onChange={handleShippingChange}
            fullWidth
            />
    </Stack>
  );
};

export default ShippingAddressForm;