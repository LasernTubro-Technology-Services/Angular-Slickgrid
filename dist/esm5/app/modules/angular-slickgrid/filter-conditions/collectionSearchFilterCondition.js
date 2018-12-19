/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { testFilterCondition } from './filterUtilities';
/** @type {?} */
export var collectionSearchFilterCondition = function (options) {
    // multiple-select will always return text, so we should make our cell values text as well
    /** @type {?} */
    var cellValue = options.cellValue + '';
    return testFilterCondition(options.operator || 'IN', cellValue, options.searchTerms || []);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvblNlYXJjaEZpbHRlckNvbmRpdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItc2xpY2tncmlkLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvYW5ndWxhci1zbGlja2dyaWQvZmlsdGVyLWNvbmRpdGlvbnMvY29sbGVjdGlvblNlYXJjaEZpbHRlckNvbmRpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7O0FBRXhELE1BQU0sS0FBTywrQkFBK0IsR0FBb0IsVUFBQyxPQUE4Qjs7O1FBRXZGLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUU7SUFFeEMsT0FBTyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM3RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmlsdGVyQ29uZGl0aW9uLCBGaWx0ZXJDb25kaXRpb25PcHRpb24gfSBmcm9tICcuLi9tb2RlbHMvaW5kZXgnO1xyXG5pbXBvcnQgeyB0ZXN0RmlsdGVyQ29uZGl0aW9uIH0gZnJvbSAnLi9maWx0ZXJVdGlsaXRpZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25TZWFyY2hGaWx0ZXJDb25kaXRpb246IEZpbHRlckNvbmRpdGlvbiA9IChvcHRpb25zOiBGaWx0ZXJDb25kaXRpb25PcHRpb24pID0+IHtcclxuICAvLyBtdWx0aXBsZS1zZWxlY3Qgd2lsbCBhbHdheXMgcmV0dXJuIHRleHQsIHNvIHdlIHNob3VsZCBtYWtlIG91ciBjZWxsIHZhbHVlcyB0ZXh0IGFzIHdlbGxcclxuICBjb25zdCBjZWxsVmFsdWUgPSBvcHRpb25zLmNlbGxWYWx1ZSArICcnO1xyXG5cclxuICByZXR1cm4gdGVzdEZpbHRlckNvbmRpdGlvbihvcHRpb25zLm9wZXJhdG9yIHx8ICdJTicsIGNlbGxWYWx1ZSwgb3B0aW9ucy5zZWFyY2hUZXJtcyB8fCBbXSk7XHJcbn07XHJcbiJdfQ==