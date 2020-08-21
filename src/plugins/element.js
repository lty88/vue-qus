import Vue from "vue" 
import { Button,link, DatePicker, Message, MessageBox, Form, FormItem,RadioGroup ,Input, Drawer, Select, option, Loading, table,pagination, Radio, Image, Upload, Progress, Switch,Popover, TableColumn,Alert,dialog } from 'element-ui';
Vue.use(DatePicker);
Vue.use(Drawer);
Vue.use(Select);
Vue.use(link);
Vue.use(Alert)
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

Vue.prototype.$message = Message;
Vue.prototype.$MessageBox = MessageBox;

Vue.prototype.$confirm = MessageBox.confirm