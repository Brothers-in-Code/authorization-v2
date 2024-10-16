(() => {
  const scanGroupStatusBtn = document.getElementById(
    'btn-save-scan-group-status',
  );

  const scanGroupStatusCheckboxList = document.querySelectorAll(
    '.scan-group-status-checkbox',
  );

  const scanGroupMap = new Map();

  scanGroupStatusBtn.addEventListener('click', () => {
    const url = document.location.href;
    const data = createParams(scanGroupMap);

    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scanGroupStatus: data }),
    }).then((res) => {
      if (res.ok) {
        document.location.reload();
      }
    });
  });

  if (scanGroupStatusCheckboxList) {
    scanGroupStatusCheckboxList.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;
        const groupVkId = checkbox.dataset.groupVkId;
        changeScanGroupMap(scanGroupMap, isChecked, groupVkId);
        changeBtnStatus(scanGroupMap);
      });
    });
  }

  function createParams(scanGroupMap) {
    const data = [];
    for (let [key, value] of scanGroupMap.entries()) {
      const obj = {
        vkid: key,
        isScan: value,
      };
      data.push(obj);
    }
    return data;
  }

  function changeScanGroupMap(scanGroupMap, isScan, groupVkId) {
    if (!scanGroupMap.has(groupVkId)) {
      scanGroupMap.set(groupVkId, isScan);
    } else {
      scanGroupMap.delete(groupVkId);
    }
  }

  function changeBtnStatus(scanGroupMap) {
    if (scanGroupStatusBtn) {
      if (scanGroupMap.size > 0) {
        scanGroupStatusBtn.disabled = false;
        scanGroupStatusBtn.classList.remove('btn-disabled');
      } else {
        scanGroupStatusBtn.disabled = true;
        scanGroupStatusBtn.classList.add('btn-disabled');
      }
    }
  }
})();

function saveScanGroupStatus() {
  const t = 0;
}
