"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAllReaders } from "@/utils/auth/adminApi";
import formatDate from "@/utils/formatDate";
import Link from "next/link";

const Readers = () => {
  const [readers, setReaders] = useState([]);

  useEffect(() => {
    const fetchReaders = async () => {
      const reader = await getAllReaders();
      if (!reader) {
        console.error(
          "No reader returned. Possibly unauthorized or server error."
        );
      } else {
        console.log("All reader from Admin Panel:", reader);
        setReaders(reader);
      }
    };

    fetchReaders();
  }, []);

  return (
    <div className="ml-3">
      <h2>Readers</h2>
      <div className="grid gap-y-5 mb-5 xxs:grid-cols-2 xs:grid-cols-3 medium:grid-cols-3 sm:grid-cols-4 max-w-[600px] justify-between mt-3">
        <div className="flex flex-col w-[130px] h-[120px] justify-evenly pt-3 items-center border border-orange-200 rounded-md">
          <p className="text-sm">All Readers</p>
          <p className="text-2xl font-bold">10,450</p>
          <p />
        </div>

        <div className="flex flex-col w-[130px] h-[120px] justify-evenly pt-3  text-orange-300 items-center border border-orange-200 rounded-md">
          <p className="text-sm">Premium Readers</p>
          <p className="text-2xl font-bold">10,450</p>
          <p />
        </div>

        <div className="flex flex-col w-[140px] h-[120px] justify-evenly pt-3 text-green-600 items-center border border-orange-200 rounded-md">
          <p className="text-sm">Top Readers</p>
          <p className="text-2xl font-bold">10,450</p>
          <p />
        </div>

        <div className="flex flex-col w-[140px] h-[120px] justify-evenly pt-3 text-red-600 items-center border border-orange-200 rounded-md">
          <p className="text-sm">Free Plan Readers</p>
          <p className="text-2xl font-bold">10,450</p>
          <p />
        </div>
      </div>
      <div className="overflow-x-auto w-full max-w-[850px] relative">
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-700 hover:bg-slate-700 rounded-lg">
                <TableHead className="text-white">Account Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Phone Number</TableHead>
                <TableHead className="text-white">Registration Date</TableHead>
                <TableHead className="text-white text-center"></TableHead>
              </TableRow>

              {/* Filter Icon Row */}
              <TableRow className="hover:bg-white">
                <TableHead />
                <TableHead />
                <TableHead />
                <TableHead />
                <TableHead className="text-center">
                  <FontAwesomeIcon
                    icon={faSlidersH}
                    className="text-slate-700 w-6 h-10 py-1 bg-slate-100 shadow-lg rounded-md cursor-pointer inline-block"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {readers?.length ? (
                readers.map((reader) => (
                  <TableRow key={reader.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Link href={`/admin/readers/reader-details/${reader.id}`}>
                        {reader?.reader_profile_image_url ? (
                          <Image
                            src={reader.reader_profile_image_url}
                            width={32}
                            height={32}
                            alt={`Profile picture of ${reader.first_name} ${reader.last_name}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <Image
                            src="/images/avatar.png"
                            width={32}
                            height={32}
                            alt={`Default avatar for ${reader.first_name} ${reader.last_name}`}
                            className="w-8 h-8 rounded-full object-cover bg-slate-400"
                          />
                        )}
                        <p className="align-middle">
                          {reader.last_name} {reader.first_name}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell className="align-middle">
                      {reader.email}
                    </TableCell>
                    <TableCell className="align-middle">
                      {reader.phone_number}
                    </TableCell>
                    <TableCell className="align-middle">
                      {formatDate(reader.created_at)}
                    </TableCell>
                    <TableCell className="text-center"></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">
                    No readers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Readers;
