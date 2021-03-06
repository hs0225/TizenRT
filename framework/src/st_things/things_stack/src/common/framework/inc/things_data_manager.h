/* ****************************************************************
 *
 * Copyright 2017 Samsung Electronics All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 ******************************************************************/

#ifndef _THINGS_DATA_MANAGER_H_
#define _THINGS_DATA_MANAGER_H_

#include "things_server_builder.h"
#include "cloud_manager.h"
#include "things_api.h"

#include <wifi_manager/wifi_manager.h>

#define MAX_DEVICE_TYPE_LENGTH         (25)
#define MAX_DEVICE_NAME_LENGTH         (32)
#define MAX_DEVICE_VER_P               (32)
#define MAX_DEVICE_VER_OS              (32)
#define MAX_DEVICE_VER_HW              (32)
#define MAX_DEVICE_VER_FW              (32)
#define MAX_DEVICE_ID_LENGTH           (37)
#define MAX_DEVICE_VENDER_ID           (255)
#define MAX_DEVICE_DESCRIPTION_LENGTH  (255)
#define MAX_DEVICE_CAPABILTY_CNT       (50)
#define MAX_DEVICE_MODEL_ID_LENGTH     (64)
#define MAX_FILE_ACCESS_CNT             (10)
#define MAX_URI_LENGTH_OCF              (128)
#define MAX_PROPERTY_CNT                (20)
#define MAX_FILE_PATH_LENGTH            (250)
#define MAX_PROPERTY_LENGTH_OCF         (64)

struct st_resource_type_s {
	char rt[MAX_PROPERTY_LENGTH_OCF];
	int prop_cnt;
	struct things_attribute_info_s *prop[MAX_PROPERTY_CNT];
} st_resource_type_s;

struct col_resource_s {
	char uri[MAX_URI_LENGTH_OCF];
	char *interface_types[MAX_IT_CNT];
	struct things_resource_info_s *links[MAX_DEVICE_CAPABILTY_CNT];
	char *resource_types[MAX_RT_CNT];

	int if_cnt;
	int rt_cnt;
	int link_cnt;
	int policy;
} col_resource_s;

typedef struct st_device_s {
	int no;
	char type[MAX_DEVICE_TYPE_LENGTH];
	char name[MAX_DEVICE_NAME_LENGTH];
	char model_num[MAX_DEVICE_MODEL_ID_LENGTH];
	char ver_p[MAX_DEVICE_VER_P];	// mnpv
	char ver_os[MAX_DEVICE_VER_OS];	// mnhw
	char ver_hw[MAX_DEVICE_VER_HW];	// mnhw
	char ver_fw[MAX_DEVICE_VER_FW];	// mnfv
	char device_id[MAX_DEVICE_ID_LENGTH];	// mnfv
	char vender_id[MAX_DEVICE_VENDER_ID];	// mnfv
	char description[MAX_DEVICE_DESCRIPTION_LENGTH];
	struct col_resource_s collection[MAX_DEVICE_CAPABILTY_CNT];
	struct things_resource_info_s single[MAX_DEVICE_CAPABILTY_CNT];

	int capa_cnt;
	int col_cnt;
	int sig_cnt;
	int is_physical;

	struct things_resource_s *pchild_resources[MAX_DEVICE_CAPABILTY_CNT];
} st_device_s;

int dm_init_module(const char *info_Path);

int dm_termiate_module(void);

const char *dm_get_svrdb_file_path(void);
const char *dm_get_certificate_file_path(void);
const char *dm_get_privatekey_file_path(void);
const char *dm_get_filename(int filenum);
const char *dm_get_things_device_type(int device_id);
const char *dm_get_resource_uri(int device_num, int index);
const char *dm_get_things_cloud_address(char *customized_ci_server);

const int dm_get_file_id(int filenum);
const int dm_get_num_of_files(void);
const int dm_get_num_of_children(int device_num);
const int dm_get_wifi_property_interface();
const int dm_get_ownership_transfer_method();
const wifi_freq_e dm_get_wifi_property_freq();

struct things_resource_s *dm_get_resource_instance(const char *uri, const int id);

int dm_get_device_information(int *cnt, st_device_s ***list);

long dm_get_num_of_dev_cnt(void);
st_device_s *dm_get_info_of_dev(unsigned long number);
bool dm_register_user_define_device_id(const int seq_thing_info, const char *dev_id);
bool dm_register_device_id(void);
int dm_register_resource(things_server_builder_s *builder);

int save_acces_point_info(wifi_manager_ap_config_s *connect_config);
int dm_update_things_cloud(es_cloud_signup_s *cl_data);
int dm_load_legacy_cloud_data(es_cloud_signup_s **cl_data);

bool dm_is_rsc_published(void);

int dm_del_things_cloud_data(void);
bool dm_is_there_things_cloud(void);

int dm_validate_attribute_in_request(char *res_type, const void *payload);

typedef enum {
	es_conn_type_none = 0,
	es_conn_type_softap = 1,
	es_conn_type_ble = 2,
} easysetup_connectivity_type_e;

easysetup_connectivity_type_e dm_get_easysetup_connectivity_type(void);
wifi_manager_softap_config_s *dm_get_softap_wifi_config(void);
wifi_manager_ap_config_s *dm_get_homeap_wifi_config();

#endif							// _THINGS_DATA_MANAGER_H_
