import type { ApiPic, PicListResponse } from "@/modules/master-data/master-pic/MasterPic.type";

export const MOCK_API_PICS: ApiPic[] = [
  {
    id: "pic-1",
    name: "Aurora",
    status: 1,
    created_by: null,
    created_at: "2026-11-04 20:57:01",
    updated_at: "2026-11-04 20:57:27",
  },
  {
    id: "pic-2",
    name: "Kristofer",
    status: 0,
    created_by: null,
    created_at: null,
    updated_at: null,
  },
];

export const MOCK_PIC_LIST_RESPONSE: PicListResponse = {
  data: MOCK_API_PICS,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_PICS.length,
  has_previous: false,
  has_next: false,
};
