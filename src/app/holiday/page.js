'use client'
import * as React from "react"
import { useEffect, useState } from 'react'
import DataTable from './data-table'
import { columns } from './columns'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

const HolidaysListing = () => {
	const [data, setData] = useState([]);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [name, setName] = useState("")
	const [date, setDate] = useState()
	const [state, setState] = useState("")
	const [errors, setErrors] = useState({ state: false, name: false, date: false });
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fetchPublicHolidays = async () => {
		console.log(pagination.pageIndex,'pagination.pageIndex')
		try {
			const start = pagination.pageSize * pagination.pageInde;
			const Path = `https://secret-stream-29335.herokuapp.com/api/v1/web/attendance-management/public-holidays/?length=${pagination.pageSize}&start=${start}`;
			const response = await axios.get(Path);
			if (response.status === 200) {
				setData(response.data.data);
				setTotalRecords(response.data.recordsTotal);
			}
		} catch (error) {
			console.log("Error fetching public holidays:", error);
		}
	};

	useEffect(() => {
		fetchPublicHolidays();
	}, [pagination]);

	const handlePaginationChange = (newPagination) => {
		setPagination((prev) => ({ ...prev, ...newPagination }));
	};

	const handleSubmit = async () => {
		
		setErrors({ state: false, name: false, date: false });

		const newErrors = {
			state: !state,
			name: !name,
			date: !date,
		};
		setErrors(newErrors);

		if (newErrors.state || newErrors.name || newErrors.date) {
			return;
		}

		let formattedDate;
		if (date) {
			const dateString = new Date(date);
			formattedDate = dateString.toISOString().split('T')[0];
		}
		const reqObj = {
			name: name,
			stateCode: state,
			date: formattedDate,
		};

		try {
			const Path = `https://secret-stream-29335.herokuapp.com/api/v1/web/attendance-management/public-holidays/`;
			const response = await axios.post(Path, reqObj, {
				headers: {
					'Authorization': 'Token 898513d2a7108d2c662a878720391aa00bc704db',
				}
			});
			if (response.status === 200) {
				setName("");
				setState("");
				setDate(null);
				setIsDialogOpen(false);
			}
		} catch (error) {
			if (error.response) {
				console.log("Response error:", error.response.data);
			  } else if (error.request) {
				console.log("Request error:", error.request);
			  } else {
				console.log("General error:", error.message);
			  }
		}
	};

	return (
		<div className="container mx-auto py-10">
			<div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger className="mb-3" asChild>
						<Button variant="secondary" onClick={() => setIsDialogOpen(true)}>Add Holiday</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Create Public Holiday</DialogTitle>
							<DialogDescription>
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">

							<div className="flex flex-col items-start gap-4">
								<Label htmlFor="state" className={`text-right ${errors.state ? "text-red-500" : ""}`}>
									State
								</Label>
								<Select name="state" onValueChange={(value) => setState(value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select a state" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>States</SelectLabel>
											<SelectItem value="DE-MV">Mecklenburg-Vorpommern</SelectItem>
											<SelectItem value="DE-HE">Hessen</SelectItem>
											<SelectItem value="DE-HH">Hamburg</SelectItem>
											<SelectItem value="DE-BE">Berlin</SelectItem>
											<SelectItem value="DE-BW">Baden-Württemberg</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								{errors.state && <p className="text-red-500">This field is required.</p>}
							</div>

							<div className="flex flex-col items-start gap-4">
								<Label htmlFor="name" className={`text-right ${errors.name ? "text-red-500" : ""}`}>
									Public Holiday Name
								</Label>
								<Input
									id="name"
									placeholder="Public Holiday Name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								{errors.name && <p className="text-red-500">This field is required.</p>}
							</div>

							<div className="flex flex-col items-start gap-4">
								<Label htmlFor="date" className={`text-right ${errors.date ? "text-red-500" : ""}`}>
									Date
								</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={cn(
												"w-full justify-start text-left font-normal",
												!date && "text-muted-foreground"
											)}
										>
											<CalendarIcon />
											{date ? format(date, "PPP") : <span>Pick a date</span>}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={date}
											onSelect={setDate}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								{errors.date && <p className="text-red-500">This field is required.</p>}
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" variant="secondary"  onClick={() => setIsDialogOpen(false)}>Cancel</Button>
							<Button type="submit" onClick={handleSubmit}>Submit</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			<DataTable
				columns={columns}
				data={data}
				pagination={pagination}
				totalRecords={totalRecords}
				onPaginationChange={handlePaginationChange}
			/>
		</div>
	)
}

export default HolidaysListing;
