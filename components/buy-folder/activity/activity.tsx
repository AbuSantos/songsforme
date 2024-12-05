import { isConnected } from "@/atoms/session-atom";
import { Copy } from "@/components/actions/copy";
import { fetcher } from "@/lib/utils";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

export const BuyActivity = () => {
    const userId = useRecoilValue(isConnected)?.userId;

    // Conditionally set the API URL only if userId is available
    const apiUrl = userId ? `/api/activities/${userId}` : null;

    // Use SWR to fetch data; only fetch if `apiUrl` is not null
    const { data: activities, error, isLoading } = useSWR(
        apiUrl,
        apiUrl ? fetcher : null,
        {
            shouldRetryOnError: true,
            errorRetryCount: 3,
        }
    );

    console.log(activities)

    // Loading state
    if (isLoading) {
        return <p>Loading activities...</p>;
    }

    // Error state
    if (error) {
        console.error("Error fetching activities:", error);
        return <p>Failed to load activities. Please try again later.</p>;
    }

    // Empty state
    if (!activities || activities.length === 0) {
        return <p>No activities found.</p>;
    }

    // Render activities
    return (
        <section>
            {activities?.data?.map((activity: any) => (
                <div
                    key={activity.id}
                    className="flex items-start space-x-2 bg-[#191919] w-[20rem] rounded-md p-4 mb-4"
                >
                    <div>
                        <h1 className="text-[#EEEEEE] font-semibold capitalize flex items-center">
                            {activity.metadata.message}
                        </h1>
                        <span className="text-[#7B7B7B] text-sm">
                            {new Date(activity.metadata.timestamp).toLocaleString()}
                        </span>

                    </div>

                    <div>
                        <h1 className="text-[#EEEEEE] font-semibold">
                            {`${activity.metadata?.price} ETH`}
                        </h1>
                    </div>

                    <Copy address={activity?.metadata?.nftAddress} mode="data" />
                </div>
            ))}
        </section>
    );
};
