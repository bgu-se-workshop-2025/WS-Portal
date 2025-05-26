import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DiscountDataModel } from "../DiscountTypes";
import PaginatedDiscountsTable from "./components/PaginatedDiscountsTable";
import { Add, Loyalty } from "@mui/icons-material";
import StoreDiscountEditor from "../StoreDiscountEditor/StoreDiscountEditor";
import useDiscounts from "../hooks/useDiscounts";

const MainContainerProps = {
	display: "flex",
	gap: 2,
	padding: 4,
	paddingLeft: 8,
};

export type StoreDiscountsPageProps = {
	context: {
		storeId: string;
	}
};

const CommandBar = ({ createDiscount, disabled }: {
	disabled: boolean;
	createDiscount: (policy: DiscountDataModel) => Promise<void>
}) => {
	const [open, setOpen] = useState(false);

	const handleClicked = () => {
		setOpen(true);
	}

	return <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
		<Button
			disabled={disabled}
			onClick={handleClicked}
		>
			<Add />Create New Discount
		</Button>
		<StoreDiscountEditor
			openState={{ open, setOpen }}
			createDiscount={createDiscount}
		/>
	</Stack>
}

const StoreDiscountsPage = ({ context }: StoreDiscountsPageProps) => {
	const {
		discounts,
		loading,
		error,
		fetchDiscounts,
		createDiscount,
		deleteDiscount,
	} = useDiscounts({ storeId: context.storeId });

	useEffect(() => {
		fetchDiscounts();
	}, []);


	return (
		<Stack sx={MainContainerProps}>
			<Typography variant="h4">Store Discounts <Loyalty /></Typography>
			<CommandBar {...{ context, createDiscount }} disabled={loading} />
			{loading &&
				<Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
					<CircularProgress />
				</Stack>
			}
			{!loading && discounts.length === 0 &&
				<Stack>
					<PaginatedDiscountsTable rows={discounts} deleteDiscount={deleteDiscount} />
					<Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: '100%' }} padding={2}>
						{!error
							? <Typography variant="body1" color="textSecondary">No discounts available.</Typography>
							: <Typography variant="body1" color="error"> Something went wrong while fetching the discounts: {error}</Typography>
						}
					</Stack>
				</Stack>
			}
			{!loading && discounts.length > 0 &&
				<PaginatedDiscountsTable rows={discounts} deleteDiscount={deleteDiscount} />
			}
		</Stack>
	);
};

export default StoreDiscountsPage;
