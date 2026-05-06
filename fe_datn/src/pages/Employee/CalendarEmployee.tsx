import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";

import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import { jwtDecode } from "jwt-decode";
import DetailPlanService from "../../service/DetailPlanService";
import { Tag, Tooltip } from "antd";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const colorMap = {
  Purple: "bg-purple-500",
  Warning: "bg-orange-500",
  Primary: "bg-blue-500",
  Success: "bg-green-500",
  Danger: "bg-red-500",
  Secondary: "bg-gray-500",
};

const CalendarEmployee: React.FC = () => {
  const renderStatusTag = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return <Tag color="purple">Đang đợi content</Tag>;
      case "WAITING":
        return <Tag color="warning">Đang chờ duyệt</Tag>;
      case "INPROGRESS":
        return <Tag color="processing">Đang thực hiện</Tag>;
      case "COMPLETED":
        return <Tag color="success">Hoàn thành</Tag>;
      case "CANCELED":
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag>{status || "Không rõ"}</Tag>;
    }
  };
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const token = localStorage.getItem("accessToken");
  let decoded = jwtDecode(token);
  let accountId = decoded.accountId;
  const today = new Date();

  const [filter, setFilter] = useState({
    performerId: accountId,
    month: null,
    year: null,
  });

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  const mapStatusToColor = (status: string, timelineUp: string) => {
    const now = new Date();
    const taskTime = new Date(timelineUp);

    //  Ưu tiên CANCEL trước
    if (status === "CANCELED") {
      return "Secondary"; // xám
    }

    //  Sau đó mới check quá hạn
    if (taskTime < now && status !== "COMPLETED") {
      return "Danger"; // đỏ
    }

    switch (status) {
      case "ASSIGNED":
        return "Purple"; //  tím
      case "WAITING":
        return "Warning"; //  cam
      case "INPROGRESS":
        return "Primary"; // xanh dương
      case "COMPLETED":
        return "Success"; // xanh lá
      case "CANCELED":
        return "Secondary"; //  gray
      default:
        return "Primary";
    }
  };

  useEffect(() => {
    // Initialize with some events
    async function fetchEvents() {
      if (!filter.month || !filter.year) return;
      const res = await DetailPlanService.searchByCalendar(filter);
      console.log("res", res);
      const eventsData = res?.data?.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        start: item.timelineUp,
        end: item.timelineUp,
        allDay: true,
        extendedProps: {
          calendar: mapStatusToColor(item.status, item.timelineUp),
          status: item.status,
          data: item,
        },
      }));
      setEvents(eventsData);
    }
    fetchEvents();
  }, [filter]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const [selectedData, setSelectedData] = useState<any>(null);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const data = event.extendedProps.data;

    setSelectedData(data);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel },
              }
            : event,
        ),
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setSelectedData(null);
  };

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            datesSet={(arg) => {
              const date = arg.view.currentStart;

              setFilter({
                performerId: accountId,
                month: date.getMonth() + 1,
                year: date.getFullYear(),
              });
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          {selectedData && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Chiến dịch</label>
                <div className="font-medium">{selectedData.campaignName}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Title</label>
                <div className="font-medium">{selectedData.title}</div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Thời gian đăng</label>
                <div>
                  {new Date(selectedData.timelineUp).toLocaleString("vi-VN")}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Nền tảng</label>
                <div>{selectedData.socialPlan}</div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Content</label>
                <div>
                  {selectedData.content || (
                    <span className="italic text-gray-400">Chưa có</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Link Drive</label>
                <div>
                  {selectedData.linkDrive ? (
                    <a
                      href={selectedData.linkDrive}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Xem file
                    </a>
                  ) : (
                    <span className="italic text-gray-400">Chưa có</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Price</label>
                <div>
                  {Number(selectedData.price).toLocaleString("vi-VN")} VNĐ
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Trạng thái</label>
                <div className="mt-1">
                  {renderStatusTag(selectedData.status)}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass =
    colorMap[eventInfo.event.extendedProps.calendar] || "bg-blue-500";

  return (
    <Tooltip title={eventInfo.event.title}>
      <div className={`flex p-1 rounded-sm text-white ${colorClass}`}>
        <div className="fc-event-title truncate">{eventInfo.event.title}</div>
      </div>
    </Tooltip>
  );
};

export default CalendarEmployee;
