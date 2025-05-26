import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { DiscountDataModel } from "../DiscountTypes";
import PaginatedDiscountsTable from "./components/PaginatedDiscountsTable";
import { discountTestData } from "../DiscountTestData";
import { Add, Loyalty } from "@mui/icons-material";

const MainContainerProps = {
	display: "flex",
	gap: 2,
	padding: 4,
	paddingLeft: 8,
};

const CommandBar = () => {
	return <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
		<Button><Add />Create New Discount</Button>
	</Stack>
}

const StoreDiscountsPage = () => {
	const [discounts, setDiscounts] = useState<DiscountDataModel[]>(discountTestData);

	return (
		<Stack sx={MainContainerProps}>
			<Typography variant="h4">Store Discounts <Loyalty /></Typography>
			<CommandBar />
			<PaginatedDiscountsTable rows={discounts} />
		</Stack>
	);
};

export default StoreDiscountsPage;
