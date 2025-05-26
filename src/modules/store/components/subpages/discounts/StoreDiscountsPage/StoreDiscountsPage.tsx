import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { DiscountDataModel } from "../DiscountTypes";
import PaginatedDiscountsTable from "./components/PaginatedDiscountsTable";

const MainContainerProps = {
	display: "flex",
	gap: 2,
	padding: 4,
	paddingLeft: 8,
}

const StoreDiscountsPage = () => {
	const [discounts, setDiscounts] = useState<DiscountDataModel[]>([]);
	return (
		<Stack {...MainContainerProps}>
			<Typography variant="h4" fontWeight="bold">
				Store Discounts
			</Typography>
			<PaginatedDiscountsTable rowsPerPage={25} rows={discounts} />
		</Stack>
	);
}

export default StoreDiscountsPage;