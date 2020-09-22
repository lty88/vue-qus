import Vue from "vue" 
import { Button,link,row,Footer,Col,PageHeader,Notification,tabs,tooltip,dropdown,DropdownMenu,DropdownItem, DatePicker, Message, MessageBox, Form,Card, FormItem,RadioGroup ,Input, Drawer, Select, option, Loading, table,pagination, Radio, Image, Upload, Progress, Switch,Popover, TableColumn,Alert,dialog,container,main,header, TabPane } from 'element-ui';
Vue.use(DatePicker);
Vue.use(Drawer);
Vue.use(Select);
Vue.use(Footer);
Vue.use(PageHeader);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(dropdown);
Vue.use(tabs);
Vue.use(TabPane);
Vue.use(tooltip);
Vue.use(row);
Vue.use(Col);
Vue.use(link);
Vue.use(Card)
Vue.use(Alert)
Vue.use(header)
Vue.use(main)
Vue.use(container)
Vue.use(table);
Vue.use(Radio)
Vue.use(dialog)
Vue.use(Loading);
Vue.use(option);
Vue.component(Button.name, Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Image);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Popover);
Vue.use(Switch);
Vue.use(TableColumn);
Vue.use(pagination);
Vue.use(RadioGroup);

// Vue.prototype.$loading = Loading;

Vue.prototype.$loading = Loading.service;
Vue.prototype.$MessageBox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
// Vue.prototype.$message = Message;
// Vue.prototype.$MessageBox = MessageBox;
// Vue.prototype.$confirm = MessageBox.confirm