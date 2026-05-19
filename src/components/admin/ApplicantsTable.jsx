import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table'

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '../ui/popover'

import { MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {

    const { applicants } = useSelector(store => store.application);

    const [filterStatus, setFilterStatus] = useState("All");

    const statusHandler = async (status, id) => {

        try {
            axios.defaults.withCredentials = true;

            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                //window.location.reload();
                // instant frontend update
                const application = applicants.applications.find(
                    item => item._id === id
                );

                if (application) {
                    application.status = status.toLowerCase();
                }
            }

        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const filteredApplicants =
        filterStatus === "All"
            ? applicants?.applications
            : applicants?.applications?.filter(
                item => item?.status?.toLowerCase() === filterStatus.toLowerCase()
                
            );

    return (
        <div>

            {/* FILTER */}

            <div className='mb-4 flex justify-end'>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className='border rounded-md px-3 py-2 text-sm outline-none'
                >
                    <option value="All">All</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                </select>

            </div>

            <Table>

                <TableCaption>
                    A list of your recent applied users
                </TableCaption>

                <TableHeader>

                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>

                </TableHeader>

                <TableBody>

                    {
                        filteredApplicants &&
                        filteredApplicants.map((item) => (

                            <TableRow
                                key={item._id}
                                className={`
                                    ${item?.status === "accepted"
                                        ? "bg-green-50"
                                        : ""
                                    }

                                    ${item?.status === "rejected"
                                        ? "bg-red-50"
                                        : ""
                                    }
                                `}
                            >

                                <TableCell>
                                    {item?.applicant?.fullName}
                                </TableCell>

                                <TableCell>
                                    {item?.applicant?.email}
                                </TableCell>

                                <TableCell>
                                    {item?.applicant?.phoneNumber}
                                </TableCell>

                                <TableCell>
                                    {item?.score}
                                </TableCell>

                                <TableCell>

                                    {
                                        item.applicant?.profile?.resume ? (
                                            <a
                                                className="text-blue-600 cursor-pointer hover:underline"
                                                href={item?.applicant?.profile?.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                               
                                            >
                                                {item?.applicant?.profile?.resumeOriginalName}
                                            </a>
                                        ) : (
                                            <span>NA</span>
                                        )
                                    }

                                </TableCell>

                                <TableCell>
                                    {item?.createdAt.split("T")[0]}
                                </TableCell>

                                {/* STATUS */}

                                <TableCell>

                                    <span
                                        className={`
                                            px-3 py-1 rounded-full text-xs text-white

                                            ${item?.status === "accepted"
                                                ? "bg-green-500"
                                                : item?.status === "rejected"
                                                    ? "bg-red-500"
                                                    : "bg-gray-500"
                                            }
                                        `}
                                    >
                                        {item?.status?.toUpperCase()}
                                    </span>

                                </TableCell>

                                {/* ACTION */}

                                <TableCell className="text-right">

                                    <Popover>

                                        <PopoverTrigger>
                                            <MoreHorizontal className='cursor-pointer' />
                                        </PopoverTrigger>

                                        <PopoverContent className="w-32">

                                            {
                                                shortlistingStatus.map((status, index) => (

                                                    <div
                                                        key={index}
                                                        onClick={() =>
                                                            statusHandler(status, item?._id)
                                                        }
                                                        className='flex w-fit items-center my-2 cursor-pointer hover:text-blue-500'
                                                    >
                                                        <span>{status}</span>
                                                    </div>

                                                ))
                                            }

                                        </PopoverContent>

                                    </Popover>

                                </TableCell>

                            </TableRow>

                        ))
                    }

                </TableBody>

            </Table>

        </div>
    )
}

export default ApplicantsTable