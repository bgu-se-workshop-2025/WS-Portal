import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { DiscountDataModel } from "../DiscountTypes";
import PaginatedDiscountsTable from "./components/PaginatedDiscountsTable";
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
	const [discounts, setDiscounts] = useState<DiscountDataModel[]>([]); // todo initialize with actual data from the store
	const [loading, setLoading] = useState(true);

	useState(() => {
		if (false) { // todo replace with actual condition to fetch discounts
			setDiscounts([]);
		}
		setTimeout(() => { setLoading(false); }, 2000); // Simulate a delay for loading
	},);

	return (
		<Stack sx={MainContainerProps}>
			<Typography variant="h4">Store Discounts <Loyalty /></Typography>
			<CommandBar />
			{loading &&
				<Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
					<CircularProgress />
				</Stack>
			}
			{!loading && discounts.length === 0 &&
				<Stack>
					<PaginatedDiscountsTable rows={discounts} />
					<Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: '100%' }} padding={2}>
						<Typography variant="body1" color="textSecondary">No discounts available.</Typography>
					</Stack>
				</Stack>
			}
			{!loading && discounts.length > 0 &&
				<PaginatedDiscountsTable rows={discounts} />
			}
		</Stack>
	);
};

export default StoreDiscountsPage;
