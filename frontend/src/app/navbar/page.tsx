import { Search, Bell, UserCircle } from "lucide-react"
import {useState, useEffect} from "react"
import axiosInstance from "@/app/utils/axiosInstance"


interface UserDocument{
    name: string;
    email: string;
    phoneNumber: string;
    wallet: string;
}


  export default function NavBar() {
    const backend_url = "http://localhost:3000"
    const [user_name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [userError, setUserError] = useState<boolean>(false)
    const [userData, setUserData] = useState<string>("")

 useEffect(() => {
        const fetchUserData = async () => {
          try {
            const user_data = await axiosInstance.get(`${backend_url}/auth/get-cookie-data`);
            const dataString = user_data.data.userData;
            const data = JSON.parse(dataString);
            console.log((user_data.data.userData));
            const email = data.email;
            console.log(email);
            setEmail(email); // Set the email state

            const user = await axiosInstance.get<UserDocument>(`${backend_url}/user/${email}`);
            setName(user.data.name);

          } catch (error) {
            setUserError(true); // Set the error state to true
          }
        };

        fetchUserData(); // Call the async function inside useEffect
    }, []); // Add dependency array to avoid infinite loop


  return (
    <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center bg-white rounded-md px-4 py-2 shadow">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input type="text" placeholder="Search here..." className="outline-none w-64" />
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5" />
            <div className="flex items-center space-x-2">
              <UserCircle className="w-6 h-6" />
              <span>{user_name}</span>
            </div>
          </div>
        </div>
        </main>
        );
}

  