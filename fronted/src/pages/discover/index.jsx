import React, { useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAllUser } from "@/config/redux/action/authAction";
export default function discoover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {

    if(!authState.all_profiles_fetched){
        dispatch(getAllUser())
    }
    dispatch(getAllPosts());
    dispatch(getAllUser());
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Search</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
