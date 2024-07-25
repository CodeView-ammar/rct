from django.shortcuts import render
from todo.models import Week,Task
from django.db.models import Count
# Create your views here.
# Dashboard
def task(request):
    # Get the base queryset for tasks
    context=[]
    queryset = Task.objects.all()

    # Annotate the queryset with task counts and group by name and date
    annotated_queryset = queryset.values('Week__date', 'Week__name').annotate(
        task_count=Count('id')
    )

    # Convert the annotated queryset to a list of dictionaries
    # This will be used for grouping and displaying
    data = list(annotated_queryset)

    # Group the data by week date and task name
    grouped_data = {}
    for entry in data:
        week_date = entry['Week__date']
        Week__name = entry['Week__name']
        task_count = entry['task_count']

        if week_date not in grouped_data:
            grouped_data[week_date] = {}

        if Week__name not in grouped_data[week_date]:
            grouped_data[week_date][Week__name] = {'task_count': 0, 'tasks': []}

        grouped_data[week_date][Week__name]['task_count'] += task_count
        grouped_data[week_date][Week__name]['tasks'].append(entry)

    # Prepare a new list for display
    display_list = []
    for week_date, week_data in grouped_data.items():
        week_str = week_date.strftime('%Y-%m-%d')
        for Week__name, task_info in week_data.items():
            task_count = task_info['task_count']
            tasks = task_info['tasks']

            # print(Week__name)
            # context[str(Week__name)] = tasks
            # context["week_date"]=week_str
            # context["week_name"]=Week__name
            display_list.append([week_str, Week__name, task_count, tasks])

    # context["model"] = display_list
    # Return the modified list for display
    # return display_list
    print(grouped_data)
    return render(request, 'todo/change_list.html', grouped_data)