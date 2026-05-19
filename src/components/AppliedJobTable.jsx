import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from './ui/dialog'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const [open, setOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState("");
    const feedbackHandler = (feedback) => {
        setSelectedFeedback(feedback);
        setOpen(true);
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell>{
                                    appliedJob?.feedback ? (
                                        <span onClick={() => feedbackHandler(appliedJob.feedback)} className="text-blue-500 cursor-pointer hover:underline">
                                            view
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">
                                            No Feedback
                                        </span>
                                    )
                                }</TableCell>
                                <TableCell className="text-right"><Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Recruiter Feedback
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-gray-700">
                        {selectedFeedback}
                    </p>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AppliedJobTable